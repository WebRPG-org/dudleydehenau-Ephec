import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatTableModule} from '@angular/material/table';
import { SupabaseCRUDService } from '../services/supabaseCRUD.service';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';





@Component({
  selector: 'app-modifier',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatSelectModule,
    ConfirmDeleteComponent,
    MatDialogModule,
    CommonModule,
    FormsModule,
    MatCheckboxModule
  ],
  templateUrl: './modifier.component.html',
  styleUrl: './modifier.component.scss'
})
export class ModifierComponent implements OnInit{


  composantsResistances: any[] = [];
  composantsLeds: any[] = [];
  composantsTransistors: any[] = [];
  composantsCondensateur: any[] = [];
  composantsDiode: any[] = [];
  typeList: any[] = [];
  headerNames: string[] = ['id', 'image', 'type', 'value', 'quantity', 'delete'];

  typeEdit_On = -1;
  valueEdit_On = -1;
  quantityEdit_On = -1;

  temporaryQuantity = 0;
  temporaryValue = "";

  newImageSelected: File | null = null;

  //le tableau contenant chaque catégorie de composant affichées ou non
  tableResistanceShow = true;
  tableLedShow = true;
  tableTransistorShow = true;
  tableCondensateurShow = true;
  tableDiodeShow = true;

  //checkbox des différents composant activé ou non
  tableResistanceShowBox = true;
  tableLedShowBox = true;
  tableTransistorShowBox = true;
  tableCondensateurShowBox = true;
  tableDiodeShowBox = true;


  selectedTypeId = -1;

  compteur = 0;
  



  constructor(private supabaseCRUD: SupabaseCRUDService, private router: Router, private dialog: MatDialog){}


  activeTable(nomTable: string){
    if(nomTable == 'resistance'){
      this.tableResistanceShow = !this.tableResistanceShow;
    }
    if(nomTable == 'led'){
      this.tableLedShow = !this.tableLedShow;
    }
    if(nomTable == 'transistor'){
      this.tableTransistorShow = !this.tableTransistorShow;
    }
    if(nomTable == 'condensateur'){
      this.tableCondensateurShow = !this.tableCondensateurShow;
    }
    if(nomTable == 'diode'){
      this.tableDiodeShow = !this.tableDiodeShow;
    }
  }

  //récupération des données dans la base de donnée
  async getData(){
    let data = await this.supabaseCRUD.getComponentsWithDetails();
    let dataType = await this.supabaseCRUD.getTypeIdComponent();
    this.composantsResistances = data.filter(component => component.Type?.Id === 1);
    this.composantsLeds = data.filter(component => component.Type?.Id === 2);
    this.composantsTransistors = data.filter(component => component.Type?.Id === 3);
    this.composantsCondensateur = data.filter(component => component.Type?.Id === 4);
    this.composantsDiode = data.filter(component => component.Type?.Id === 5);
    this.typeList = dataType;
  }

  async saveQuantity(componentElement: any){
    if(this.temporaryQuantity > 0){
      await this.supabaseCRUD.updateQuantity(componentElement.Id, this.temporaryQuantity);
      
      await this.getData(); //update la page

      this.quantityEdit_On = -1;
      this.temporaryQuantity = 0;
    }
  }

  async saveValue(componentElement: any){
    await this.supabaseCRUD.updateValue(componentElement.Feature_id, this.temporaryValue);

    console.log(componentElement.Feature_id)
    console.log(this.temporaryValue)
    await this.getData(); //update la page

    this.valueEdit_On = -1;
    this.temporaryValue = "";
  }

  changePage(){
    this.router.navigate([""]);
  }

  ngOnInit(): void {
    this.getData();
  }

  editValue(idComponent: number, valueComponent: any){
    if(this.valueEdit_On === idComponent){
      this.valueEdit_On = -1;
      this.temporaryValue = "";
    }else{
      this.valueEdit_On = idComponent;
      this.temporaryValue = valueComponent;
    }
  }

  editQuantity(idComponent: number, quantiyComponent: number){
    if(this.quantityEdit_On === idComponent){
      this.quantityEdit_On = -1;
      this.temporaryQuantity =0;
    }else{
      this.quantityEdit_On = idComponent;
      this.temporaryQuantity = quantiyComponent;
    }
  }

  confirmDeleteWindow(component: any) {
    const dialogDelete = this.dialog.open(ConfirmDeleteComponent, {
      width: '650px', 
      data: { name: component.Type?.Name, value : component.Feature?.Description}
    });

    dialogDelete.afterClosed().subscribe(async result => {
      if (result === true) {
        console.log('Composant supprimé');
        await this.supabaseCRUD.deleteComponent(component.Id, component?.Feature.Id);
        await this.getData(); 
      } else {
        console.log('Suppression annulée');
      }
    });

  }

  uploadImage(){
    const userImage = document.getElementById('userImage') as HTMLInputElement;
    userImage.click();
    console.log(userImage)
  }


  async imageSelected(event: Event, componentId: number) {
    const imageInput = event.target as HTMLInputElement;
    if (imageInput.files && imageInput.files.length > 0) {
      this.newImageSelected = imageInput.files[0];
  

      const filePath = `${componentId}_${this.newImageSelected.name}`;
      console.log(componentId)
  
      await this.supabaseCRUD.uploadImageToBucket(filePath, this.newImageSelected, componentId);

      await this.getData(); 

    }
  }
}