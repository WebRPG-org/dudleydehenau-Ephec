import { Component, CUSTOM_ELEMENTS_SCHEMA, Input} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";


@Component({
  selector: 'app-carousel',
  standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive
    ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})


export class CarouselComponent {
  @Input()
  titreSection!: string;
  @Input() images: { src: string, alt: string }[] = [];
}
