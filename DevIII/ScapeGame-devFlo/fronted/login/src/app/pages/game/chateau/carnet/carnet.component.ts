import { Component } from '@angular/core';

@Component({
  selector: 'app-carnet',
  standalone: true,
  imports: [],
  templateUrl: './carnet.component.html',
  styleUrl: './carnet.component.scss'
})
export class CarnetComponent {

  
  ImageCarnetListe = ["assets/chateau/carnet/carnetDeuxSquellettes.png", "assets/chateau/carnet/carnetSquellette.png", "assets/chateau/carnet/carnetCle.png", "assets/chateau/carnet/carnetMotDePasse.png", "assets/chateau/carnet/carnetPortailEnigme.png"]
  page = 0;
  pageMax = 4;
  cheminImageCarnet = this.ImageCarnetListe[this.page];

  imageSuivante(){
    if(this.page >= this.pageMax){
      this.page = 0;
    }else{
      this.page += 1;
    }
    this.cheminImageCarnet = this.ImageCarnetListe[this.page];
  }
}
