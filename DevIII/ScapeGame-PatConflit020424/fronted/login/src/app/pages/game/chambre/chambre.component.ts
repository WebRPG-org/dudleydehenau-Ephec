import { Component } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {NgForOf, NgIf} from "@angular/common";


@Component({
  selector: 'app-chambre',
  standalone: true,
  imports: [MatGridListModule, NgForOf, NgIf],
  templateUrl: './chambre.component.html',
  styleUrl: './chambre.component.scss'
})
export class ChambreComponent {
   titles = [
    { text: 'Tile 1', cols: 2, rows: 4, color: 'lightblue' },
    { text: 'Tile 2', cols: 2, rows: 4, color: 'lightgreen' },
    { text: 'Tile 3', cols: 2, rows: 1.5, color: 'lightpink' },
    { text: 'Tile 4', cols: 1, rows: 1, color: '#DDBDF1' },
  ];

}
