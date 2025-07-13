import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SupabaseCRUDService } from '../services/supabaseCRUD.service';

@Component({
  selector: 'app-new-component',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './new-component.component.html',
  styleUrl: './new-component.component.scss'
})
export class NewComponentComponent {

  boutonActive = true;

  nouvelleImgaComposant: File | null = null;

  imageTemporaire: string | null = null; //image temporaire affiché à l'écran 
  filePath : string | '' = ''; //chemin de l'image à mettre dans la base de donnée
  imageExiste = false;
  noImageExiste = true;

  typeComposantsListe: { Id: number, Name: string}[] = [];
  selectedType = null;

  newValeurUserText = {resistance : '', led : '', transistor : '', condensateur : '', diode : ''};
  newValueText = {resistance : false, led : false, transistor : false, condensateur : false, diode : false};

  newComponenTypeId = 0;

  messageErreurImage = false;
  messageErreurValeur = false;
  messageErreurDoublon = false;
  messageErreurUnite = false;
  messageAjout = false;

  defaultUnit = null;

  constructor(private supabaseCRUD: SupabaseCRUDService) {}

  async getData(){
    let data = await this.supabaseCRUD.getType();
    this.typeComposantsListe = data;
  }

  ngOnInit() {
    this.getData();
  }


  async submitNewComponent(){
    const newComposant = {valeur : '', typeId: 0, featureId: 0, img : ''};

    if(this.newComponenTypeId > 0){
      if(this.newComponenTypeId == 1){
        newComposant.valeur = this.newValeurUserText.resistance.trim() + ' Ω';
        newComposant.typeId = 1;

        const lastIdResistance = await this.supabaseCRUD.getLatFeatureId(1);
        if(lastIdResistance == 0){
          newComposant.featureId = 1000 + 1;
        }else{
          newComposant.featureId = lastIdResistance + 1;
        }
        
      }else{
        if(this.newComponenTypeId == 2){
          newComposant.valeur = this.newValeurUserText.led;
          newComposant.typeId = 2;

          const lastIdLed = await this.supabaseCRUD.getLatFeatureId(1);
          if(lastIdLed == 0){
            newComposant.featureId = 200 + 1;
          }else{
            newComposant.featureId = lastIdLed + 1;
          }
          
        }else{
          if(this.newComponenTypeId == 3){
            newComposant.valeur = this.newValeurUserText.transistor;
            newComposant.typeId = 3;

            const lastIdTransistor = await this.supabaseCRUD.getLatFeatureId(1);
            if(lastIdTransistor == 0){
              newComposant.featureId = 300 + 1;
            }else{
              newComposant.featureId = lastIdTransistor + 1;
            }
    
          }else{
            if(this.newComponenTypeId == 4){
              newComposant.valeur = this.newValeurUserText.condensateur; 
              newComposant.typeId = 4;
  
              const lastIdCondensateur = await this.supabaseCRUD.getLatFeatureId(4);
              if(lastIdCondensateur == 0){
                newComposant.featureId = 400 + 1;
              }else{
                newComposant.featureId = lastIdCondensateur + 1;
              }

            }else{
              if(this.newComponenTypeId == 5){
                newComposant.valeur = this.newValeurUserText.diode; 
                newComposant.typeId = 5;
    
                const lastIdDiode = await this.supabaseCRUD.getLatFeatureId(5);
                if(lastIdDiode == 0){
                  newComposant.featureId = 500 + 1;
                }else{
                  newComposant.featureId = lastIdDiode + 1;
                }
              }
            }
          }
        }
      }
    }
    
    if(await this.verifieErreur(newComposant)){
      if(this.nouvelleImgaComposant != null){
        this.messageErreurImage = false;
        let nomFichier = `${newComposant.featureId}_${this.nouvelleImgaComposant.name}`
        let nouvelleImageUrl = await this.supabaseCRUD.uploadImageToBucket(nomFichier, this.nouvelleImgaComposant, -1);
        newComposant.img = nouvelleImageUrl;

        if(newComposant.typeId == 4){
          let unit = '';
          if(this.defaultUnit == 1){
            unit = ' nF'
          }else{
            unit = ' μF'
          }
          newComposant.valeur = newComposant.valeur + unit;
        }

        let newId = await this.supabaseCRUD.getLastComponentId() + 1;
        let nomCompo = `composant_${newComposant.valeur}`
        await this.supabaseCRUD.addFeature(newComposant.featureId, newComposant.valeur, newComposant.img);
        await this.supabaseCRUD.addComponent(newId, nomCompo, newComposant.typeId, 0, newComposant.featureId, newComposant.typeId);
        this.messageAjout = true;
      }else{
        this.messageErreurImage = true;
      }
    }
  }


  async verifieErreur(composant : any){
    if(composant.valeur == ' Ω' || composant.valeur.trim() == ''){
      this.messageErreurValeur = true;
      this.messageErreurDoublon = false;
      this.messageErreurUnite = false;
      return false;
    }else{
      if(this.newComponenTypeId == 4 &&(this.defaultUnit == null || this.defaultUnit == 'null')){
        this.messageErreurUnite = true;
        this.messageErreurValeur = false;
        this.messageErreurDoublon = false;
        return false;
      }else{
        if(!await this.composantValide(composant.valeur, composant.typeId)){
          this.messageErreurDoublon = true;
          this.messageErreurValeur = false;
          this.messageErreurUnite = false;
          return false;
        }else{
          this.messageErreurValeur = false;
          this.messageErreurDoublon = false;
          this.messageErreurUnite = false;
          return true;
        }
      }
    }
  }


  uploadPhoto(){
    const userImage = document.getElementById('nouvelleImgaComposant') as HTMLInputElement;
    userImage.click();
  }

  selectionImage(event: Event){
    const imageInput = event.target as HTMLInputElement;
    if (imageInput.files && imageInput.files.length > 0) {
      this.nouvelleImgaComposant = imageInput.files[0];
      this.filePath = `${this.nouvelleImgaComposant.name}`;

      const reader = new FileReader();
      reader.onload = () => {
      this.imageTemporaire = reader.result as string; 
      };
      reader.readAsDataURL(this.nouvelleImgaComposant);

      this.noImageExiste = false;
      this.imageExiste = true;
    }
  }


  afficheInsertionValeur(event : any){

    const selectedTypeId = event.value

    if(selectedTypeId == 1){
      this.newValueText.resistance = true;
      this.newValueText.led = false;
      this.newValueText.transistor = false;
      this.newValueText.condensateur = false;
      this.newValueText.diode = false;

      this.newValeurUserText.led = '';
      this.newValeurUserText.transistor = '';
      this.newValeurUserText.condensateur = '';
      this.newValeurUserText.diode = '';

      this.newComponenTypeId = 1;
    }else{
      if(selectedTypeId == 2){
        this.newValueText.resistance = false;
        this.newValueText.led = true;
        this.newValueText.transistor = false;
        this.newValueText.condensateur = false;
        this.newValueText.diode = false;

        this.newValeurUserText.resistance = '';
        this.newValeurUserText.transistor = '';
        this.newValeurUserText.condensateur = '';
        this.newValeurUserText.diode = '';

        this.newComponenTypeId = 2;
      }else{
        if(selectedTypeId == 3){
          this.newValueText.resistance = false;
          this.newValueText.led = false;
          this.newValueText.transistor = true;
          this.newValueText.condensateur = false;
          this.newValueText.diode = false;

          this.newValeurUserText.resistance = '';
          this.newValeurUserText.led = '';
          this.newValeurUserText.condensateur = '';
          this.newValeurUserText.diode = '';

          this.newComponenTypeId = 3;
        }else{
          if(selectedTypeId == 4){
            this.newValueText.resistance = false;
            this.newValueText.led = false;
            this.newValueText.transistor = false;
            this.newValueText.condensateur = true;
            this.newValueText.diode = false;
  
            this.newValeurUserText.resistance = '';
            this.newValeurUserText.led = '';
            this.newValeurUserText.transistor = '';
            this.newValeurUserText.diode = '';
  
            this.newComponenTypeId = 4;
          }else{
            if(selectedTypeId == 5){
              this.newValueText.resistance = false;
              this.newValueText.led = false;
              this.newValueText.transistor = false;
              this.newValueText.condensateur = false;
              this.newValueText.diode = true;
    
              this.newValeurUserText.resistance = '';
              this.newValeurUserText.led = '';
              this.newValeurUserText.transistor = '';
              this.newValeurUserText.condensateur = '';
    
              this.newComponenTypeId = 5;
            }else{
              this.newValueText.resistance = false;
              this.newValueText.led = false;
              this.newValueText.transistor = false;
              this.newValueText.condensateur = false;
              this.newValueText.diode = false;

              this.newValeurUserText.led = '';
              this.newValeurUserText.resistance = '';
              this.newValeurUserText.transistor = '';
              this.newValeurUserText.condensateur = '';
              this.newValeurUserText.diode = '';

              this.newComponenTypeId = 0;
            }
          }
        }
      }
    }
  }


  //fonction qui vérifie si le nouveau composant se trouve déjà dans la base de donnée
  async composantValide(newCompoValeur : string, newCompoType : number){
    let composantListe = await this.supabaseCRUD.getComponentsWithDetails();
    for(let i = 0; i < composantListe.length; i++){
      let composant = composantListe[i];
      let valeurComposant = composant.Feature?.Description;
      let typeComposant = composant.Type?.Id;

      if(newCompoType === typeComposant && newCompoValeur === valeurComposant){
        return false;
      }
    }
    return true;
  }


  reinitialisation(){
    this.boutonActive = true;

    this.nouvelleImgaComposant = null;
  
    this.imageTemporaire = null;
    this.filePath = ''; 
    this.imageExiste = false;
    this.noImageExiste = true;
  
    this.selectedType = null;
  
    this.newValeurUserText = {resistance : '', led : '', transistor : '', condensateur : '', diode : ''};
    this.newValueText = {resistance : false, led : false, transistor : false, condensateur : false, diode : false};
  
    this.newComponenTypeId = 0;
  
    this.messageErreurImage = false;
    this.messageErreurValeur = false;
    this.messageErreurDoublon = false;
    this.messageErreurUnite = false;
    this.messageAjout = false;

    this.defaultUnit = null;

  }


}
