import { Component, CUSTOM_ELEMENTS_SCHEMA, Input} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import { LevelService } from '../../services/search-levels.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-grid',
  standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        CommonModule
    ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})


export class GridComponent {
  @Input()
  titreSection!: string;
  @Input() images: { src: string, alt: string }[] = [];

  constructor(private levelService: LevelService) {}

  ngOnInit(): void {
  this.levelService.getLevelData().subscribe((niveaux: any[]) => {
    this.images = niveaux.map((niveau: any) => {
      const extension = niveau.levelName === 'chambre' ? 'png' : 'jpg';
      const src = `assets/img/${niveau.levelName}.${extension}`;
      return { src, alt: niveau.levelName };
    });
  });
}
}