import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SupabaseCRUDService } from '../services/supabaseCRUD.service';
import { NewComponentComponent } from '../new-component/new-component.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    NewComponentComponent
  ],
  templateUrl: './parametres.component.html',
  styleUrl: './parametres.component.scss',
})


export class ParametresComponent {
  ajoutComponent: string = '';
  ajoutValue: number | null = null;
  ajoutQuantity: number | null = null;

  retraitComponent: string = '';
  retraitValue: number | null = null;
  retraitQuantity: number | null = null;

  resistanceQuantity: number | null = null;
  ledQuantity: number | null = null;
  transistorQuantity: number | null = null;
  condensteurQuantity: number | null = null;
  diodeQuantity: number | null = null;

  userFirstName: string = '';
  userLastName: string = '';

  messageRestockR = {notif : false, valeur: 0};
  messageRestockL = {notif : false, valeur: 0};
  messageRestockT = {notif : false, valeur: 0};
  messageRestockC = {notif : false, valeur: 0};
  messageRestockD = {notif : false, valeur: 0};

  messageUser = {notif: false, nom: "", prenom: ""};
  messageAjouter = {notif: false, quantite: 0, composant:""};
  messageDiminuer = {notif: false, quantite: 0, composant:""};
  messageUserInvalide = false;
  messageUserInvalideDiminuer = false;
  messageUserInvalideAjouter = false;

  component = [
    { value: 'resistance', viewValue: 'Résistance' },
    { value: 'led', viewValue: 'LED' },
    { value: 'transistor', viewValue: 'Transistor' },
  ];

  ajoutValues: { value: number; viewValue: string }[] = [];
  retraitValues: { value: number; viewValue: string }[] = [];

  constructor(private supabaseCRUD: SupabaseCRUDService) {}

  updateAjoutOptions() {
    if (this.ajoutComponent === 'resistance') {
      this.ajoutValues = [
        { value: 220, viewValue: '220 ohms' },
        { value: 330, viewValue: '330 ohms' },
        { value: 400, viewValue: '400 ohms' },
      ];
    } else if (this.ajoutComponent === 'led') {
      this.ajoutValues = [
        { value: 1, viewValue: 'Rouge' },
        { value: 2, viewValue: 'Bleu' },
        { value: 3, viewValue: 'RGB' },
        { value: 4, viewValue: 'Vert' },
      ];
    }
  }

/*
  async getComposantList(){
    let typesComponentList = await this.supabaseCRUD.getType();
    this.component = [];
    for (let i = 0; i < typesComponentList.length; i++){
      this.component.push({value: typesComponentList[i].Id, viewValue : typesComponentList[i].Name});
    }
    console.log(this.component);
  }


  ngOnInit(): void {
    this.getComposantList();
  }

*/

  updateRetraitOptions() {
    if (this.retraitComponent === 'resistance') {
      this.retraitValues = [
        { value: 220, viewValue: '220 ohms' },
        { value: 330, viewValue: '330 ohms' },
        { value: 400, viewValue: '400 ohms' },
      ];
    } else if (this.retraitComponent === 'led') {
      this.retraitValues = [
        { value: 1, viewValue: 'Rouge' },
        { value: 2, viewValue: 'Bleu' },
        { value: 3, viewValue: 'RGB' },
        { value: 4, viewValue: 'Vert' },
      ];
    }
  }

  generateFeatureId(component: string, value: number): number {
    if (component === 'resistance') {
      return parseInt(`1${value}`, 10);
    } else if (component === 'led') {
      return parseInt(`20${value}`, 10);
    } else if (component === 'transistor') {
      return parseInt(`3${value}`);
    }
    return 0;
  }

  generateId(component: string): number {
    if (component === 'resistance') {
      return 1;
    } else if (component === 'led') {
      return 2;
    } else if (component === 'transistor') {
      return 3;
    }
    return 0;
  }

  submitValeurs() {
    try {
      if (this.resistanceQuantity) {
        this.supabaseCRUD.updateComponentRestock(1, this.resistanceQuantity);
        this.messageRestockR.notif = true;
        this.messageRestockR.valeur = this.resistanceQuantity;
        this.resistanceQuantity = null;
      }
      if (this.ledQuantity) {
        this.supabaseCRUD.updateComponentRestock(2, this.ledQuantity);
        this.messageRestockL.notif = true;
        this.messageRestockL.valeur = this.ledQuantity;
        this.ledQuantity = null;
        
      }
      if (this.transistorQuantity) {
        this.supabaseCRUD.updateComponentRestock(3, this.transistorQuantity);
        this.messageRestockT.notif = true;
        this.messageRestockT.valeur = this.transistorQuantity;
        this.transistorQuantity = null;
      }
      if (this.condensteurQuantity) {
        this.supabaseCRUD.updateComponentRestock(4, this.condensteurQuantity);
        this.messageRestockC.notif = true;
        this.messageRestockC.valeur = this.condensteurQuantity;
        this.condensteurQuantity = null;
      }
      if (this.diodeQuantity) {
        this.supabaseCRUD.updateComponentRestock(5, this.diodeQuantity);
        this.messageRestockD.notif = true;
        this.messageRestockD.valeur = this.diodeQuantity;
        this.diodeQuantity = null;
      }
    } catch (error) {
      console.error('Error trying to update retock value', error);
    } 
  }

  async submitModifications() {
    const ajoutId = this.generateFeatureId(
      this.ajoutComponent,
      this.ajoutValue!
    );
    const ajoutQuantity = this.ajoutQuantity ?? 0;

    const retraitId = this.generateFeatureId(
      this.retraitComponent,
      this.retraitValue!
    );
    const retraitQuantity = this.retraitQuantity ?? 0;

    try {
      if (ajoutId && ajoutQuantity) {
        await this.supabaseCRUD.updateComponent(ajoutId, ajoutQuantity);
        this.messageUserInvalideAjouter = false; //désactivation du message d'erreur 
        this.messageAjouter.notif = true;
        this.messageAjouter.quantite = ajoutQuantity;
        this.messageAjouter.composant = this.ajoutComponent
        console.log(this.ajoutValue!)

      }else{
        if (retraitId && retraitQuantity) {
        await this.supabaseCRUD.updateComponent(retraitId, -retraitQuantity);
        this.messageUserInvalideDiminuer = false; //désactivation du message d'erreur 
        this.messageDiminuer.notif = true;
        this.messageDiminuer.quantite = retraitQuantity;
        this.messageDiminuer.composant = this.retraitComponent
      }else{
        if (ajoutId || ajoutQuantity){
          this.messageAjouter.notif = false; //désactivation du message d'ajout correct d'un composant
          this.messageUserInvalideAjouter = true; //activation du message d'erreur si tous les champs n'ont pas été rempli par l'utiliateur
        }
        if (retraitId || retraitQuantity){
            this.messageDiminuer.notif = false; //désactivation du message de diminution correcte d'un composant
            this.messageUserInvalideDiminuer = true; //activation du message d'erreur si tous les champs n'ont pas été rempli par l'utiliateur
        }
      }
    }
    } catch (error) {
      console.error('Error saving modifications:', error);
    }
  }

  async submitUtilisateur() {
    try {
      if (this.userFirstName && this.userLastName) {
        await this.supabaseCRUD.insertUser(
          this.userFirstName,
          this.userLastName
        )
        this.messageUserInvalide = false;
        this.messageUser.notif = true;
        this.messageUser.nom = this.userLastName;
        this.messageUser.prenom = this.userFirstName;
        }else{
          if(this.userFirstName || this.userLastName){
            this.messageUserInvalide = true;
            this.messageUser.notif = false;
          }
        }
      
    } catch (error) {
      console.error('Error while trying to create a new user', error);
    }
    console.log('Nouvel utilisateur:', {
      firstName: this.userFirstName,
      lastName: this.userLastName,
    });
  }
}
