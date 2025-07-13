import { Component } from '@angular/core';
import { MapChateauComponent } from '../map-chateau/map-chateau.component';



@Component({
  selector: 'app-niveau',
  standalone: true,
  imports: [
    MapChateauComponent
  ],
  templateUrl: './niveau.component.html',
  styleUrl: './niveau.component.scss'
})
export class NiveauComponent {


}
