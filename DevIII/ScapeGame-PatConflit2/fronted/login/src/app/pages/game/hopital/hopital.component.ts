import { Component } from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-hopital',
  standalone: true,
    imports: [
        MatGridList,
        MatGridTile,
        NgForOf
    ],
  templateUrl: './hopital.component.html',
  styleUrl: './hopital.component.scss'
})
export class HopitalComponent {
  titles = [
    { text: 'Tile 1', cols: 2, rows: 4, color: 'lightblue' },
    { text: 'Tile 2', cols: 2, rows: 4, color: 'lightgreen' },
    { text: 'Tile 3', cols: 2, rows: 1.5, color: 'lightpink' },
    { text: 'Tile 4', cols: 1, rows: 1, color: '#DDBDF1' },
  ];

}
