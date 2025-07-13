import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PersonnageComponent } from '../personnage/personnage.component';
import { CarnetComponent } from '../carnet/carnet.component';
import { CartesIndiceComponent } from '../cartes-indice/cartes-indice.component';
import { PieceSecreteComponent } from '../piece-secrete/piece-secrete.component';



@Component({
  selector: 'app-map-chateau',
  standalone: true,
  imports: [
    CommonModule,
    PersonnageComponent,
    CarnetComponent,
    CartesIndiceComponent,
    PieceSecreteComponent
  ],
  templateUrl: './map-chateau.component.html',
  styleUrl: './map-chateau.component.scss'
})


export class MapChateauComponent {


  //lave
  laveOn: boolean = false;
  cheminImageLave: string = 'assets/chateau/map/mapChateauLave.png';

  lave(): void {
    this.laveOn = true;
  }


  coffreOn: boolean = false;

  cle(){
    this.coffreOn = true;
  }


  //coffre
  alphabetOn: boolean = false;
  cheminImageCoffre: string = 'assets/chateau/map/objets/coffreOuvert.png';

  coffreOuvert(): void {
    if(this.coffreOn == true){
      this.alphabetOn = !this.alphabetOn;
    }
  }



  //objet sur la table coté droit
  craneTableDroiteOn: boolean = true;
  cheminImageTableDroite: string = 'assets/chateau/map/objets/craneTableDroitD.png';

  tableDroite(): void {
    this.craneTableDroiteOn = !this.craneTableDroiteOn;
  }

  craneTablDroitClick()  {
    if(this.cheminImageTableDroite == "assets/chateau/map/objets/craneTableDroitD.png"){
      this.cheminImageTableDroite = 'assets/chateau/map/objets/craneTableDroitG.png';
    }else{
      this.cheminImageTableDroite = "assets/chateau/map/objets/craneTableDroitD.png"
    }
    this.craneTD = !this.craneTD;
    this.checkSecretRoom();
  }


  //objet sur la table coté gauche
  craneTableGaucheOn: boolean = true;
  cheminImageTableGauche: string = 'assets/chateau/map/objets/craneTableGaucheD.png';
  
  craneTablGaucheClick()  {
    if(this.cheminImageTableGauche == "assets/chateau/map/objets/craneTableGaucheD.png"){
      this.cheminImageTableGauche = 'assets/chateau/map/objets/craneTableGaucheG.png';
    }else{
      this.cheminImageTableGauche = "assets/chateau/map/objets/craneTableGaucheD.png"
    }
    this.craneTG = !this.craneTG;
    this.checkSecretRoom();
  }


  //objet sur la table à coté du livre
  craneLivreOn: boolean = true;
  cheminImageLivre: string = 'assets/chateau/map/objets/craneLivreG.png';
  
  craneLivreClick()  {
    if(this.cheminImageLivre == "assets/chateau/map/objets/craneLivreG.png"){
      this.cheminImageLivre = 'assets/chateau/map/objets/craneLivreD.png';
    }else{
      this.cheminImageLivre = "assets/chateau/map/objets/craneLivreG.png"
    }
    this.craneL = !this.craneL;
    this.checkSecretRoom();
  }




  //Piece secrète
  pieceSecreteOn: boolean = false;
  cheminImagePieceSecrete: string = 'assets/chateau/map/mapChateauPieceSecrete.png';

  pieceSecrete(): void {
    if(this.porteSecreteOuverte == true){
      this.pieceSecreteOn = true;
    }
  }

  carnetOn: boolean = false;

  carnet(): void {
    this.carnetOn = !this.carnetOn;
  }


  craneL: boolean = false;
  craneTG: boolean = true;
  craneTD: boolean = false;
  porteSecreteOuverte: boolean = false;

  flamePorteOn: boolean = false;
  cheminImageFlamePorte: string = 'assets/chateau/map/objets/flamePorte.png';


  checkSecretRoom(){
    if(this.craneL && this.craneTG && this.craneTD){
      this.flamePorteOn = true;
      this.porteSecreteOuverte = true;
    }else{
      this.flamePorteOn = false;
      this.porteSecreteOuverte = false;
    }
  }


  osGauche = false;
  osDroit = false;

  osCode = false;

  monstreGauche(){
    this.osGauche = true;
  }

  monstreDroit(){
    this.osDroit = true;
  }

  osMystique = false;
  osCleCoffre = false;

  osIndice(){
    this.osMystique = !this.osMystique;
  }

  osIndiceCode(){
    this.osCode = !this.osCode;
  }


  osCle(){
    this.osCleCoffre = true;
  }



  tempsDepart: Date;
  heure: number;
  minutes: number;
  secondes: number;
  totalSecondesDebut: number = 0;

  constructor() {
    this.tempsDepart = new Date();
    this.heure = this.tempsDepart.getHours();
    this.minutes = this.tempsDepart.getMinutes();
    this.secondes = this.tempsDepart.getSeconds();
    this.totalSecondesDebut = (this.heure * 3600) + (this.minutes * 60) + this.secondes;
    console.log(this.heure + " : " + this.minutes + " : " + this.secondes);
    console.log(this.totalSecondesDebut)
  }





}



