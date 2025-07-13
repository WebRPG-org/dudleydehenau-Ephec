import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PersonnageComponent } from '../personnage/personnage.component';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-map-chateau',
  standalone: true,
  imports: [
    CommonModule,
    PersonnageComponent,
    FormsModule
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


  //Porte Sortie Code
  porteOn: boolean = false;
  cheminImagePorteOverte: string = 'assets/chateau/map/mapChateauPorteOuverte.png';

  codePorteText: string = '';
  codePorteZoneTextVisible: boolean = false;

  envoyerCodePorte() {
    this.codePorteZoneTextVisible = !this.codePorteZoneTextVisible;
    if(this.codePorteText === 'lapin rose'){
      console.log('Le code :', this.codePorteText);
      this.porteOn = true;
    }else{
      console.log('Mauvais code');
    }
  }


  //Piece secrète
  pieceSecreteOn: boolean = false;
  cheminImagePieceSecrete: string = 'assets/chateau/map/mapChateauPieceSecrete.png';

  pieceSecrete(): void {
    this.pieceSecreteOn = true;
  }


  //objet sur la table coté droit
  craneTableDroiteOn: boolean = true;
  cheminImageTableDroite: string = 'assets/chateau/map/objets/craneTableDroitD.png';

  tableDroite(): void {
    this.craneTableDroiteOn = !this.craneTableDroiteOn;
  }


 






  /*


  imageVisibleCode1: boolean = false;
  imageVisibleCode2: boolean = false;
  imageVisibleSkull: boolean = false;
  imageVisibleCle: boolean = false;

  cheminImageCode1: string = 'assets/chateau/indices/indiceCode1.png';
  cheminImageCode2: string = 'assets/chateau/indices/incideCode2.png';
  cheminImageCle: string = 'assets/chateau/objets/cle.png';
  cheminImageSkull: string = 'assets/chateau/indices/indiceSkull.png';

  codePorteZoneTextVisible: boolean = false;
  porteOuverteImage: boolean = false;

  tonneau(): void {
    this.imageVisibleCode2 = !this.imageVisibleCode2;
  }

  coffre(): void {
    this.imageVisibleCode1 = !this.imageVisibleCode1;
  }

  fenetre(): void {
    this.imageVisibleCle = !this.imageVisibleCle;
  }

  skull(): void {
    this.imageVisibleSkull = !this.imageVisibleSkull;
  }

  porte(): void {
    
 
  }



  

  */

}



