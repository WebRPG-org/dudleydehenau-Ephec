import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartesIndiceComponent } from '../cartes-indice/cartes-indice.component';

@Component({
  selector: 'app-piece-secrete',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CartesIndiceComponent
  ],
  templateUrl: './piece-secrete.component.html',
  styleUrl: './piece-secrete.component.scss'
})
export class PieceSecreteComponent {

  codePorteSortieEscapeGame = "portail dimensionnel mystique";
  codePorteFlameCraneReponse = "FFCFCFCCF"
  codePorteFlameCrane = "";

    //Porte Sortie Code
    porteOn: boolean = false;
  
    codePorteText: string = '';
    codePorteZoneTextVisible: boolean = false;
  
    envoyerCodePorte() {
      this.codePorteZoneTextVisible = !this.codePorteZoneTextVisible;
      if(this.codePorteText === this.codePorteSortieEscapeGame){
        this.flameCouloirOn = true;
        this.codePorteFlameCrane = "";
      }else{
        console.log('Mauvais code');
      }
    }



  flameCouloirOn: boolean = false;
  cheminImageFlameCouloir: string = 'assets/chateau/map/objets/flameCouloir.png';

  

  flamePorteOn: boolean = false;

  flamePorte(){
    this.flamePorteOn = !this.flamePorteOn;
    this.codePorteFlameCrane += "F";
  }



  cartesOn: boolean = false;

  cartes(): void {
    this.cartesOn = !this.cartesOn;
  }



  //objet sur la table coté droit
  crane: boolean = true;
  cheminImageCrane: string = 'assets/chateau/map/objets/cranePieceSecreteG.png';

  tableDroite(): void {
    this.crane = !this.crane;
  }

  craneTable()  {
    if(this.cheminImageCrane == "assets/chateau/map/objets/cranePieceSecreteG.png"){
      this.cheminImageCrane = 'assets/chateau/map/objets/cranePieceSecreteD.png';
    }else{
      this.cheminImageCrane = "assets/chateau/map/objets/cranePieceSecreteG.png";
    }
    this.codePorteFlameCrane += "C";
  }

  flameCode = "F";
  craneCode = "C";


  validerCodePorte(){
    if(this.codePorteFlameCrane == this.codePorteFlameCraneReponse && this.flameCouloirOn == true){
      this.porteOn = true;
    }else{
      this.flameCouloirOn = false;
      this.cheminImageCrane = "assets/chateau/map/objets/cranePieceSecreteG.png";
      this.flamePorteOn = false;
      this.codePorteFlameCrane = "";
    }
  }


}


