import { Component } from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-tri',
  standalone: true,
  imports: [
    MatProgressSpinnerModule
  ],
  templateUrl: './tri.component.html',
  styleUrl: './tri.component.scss'
})
export class TriComponent {

  arretUrgence(){
    console.log("Arrêt d'urgence !")
  }
}
