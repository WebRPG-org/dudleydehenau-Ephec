import { Component, ViewChild } from '@angular/core';
import {ToolbarComponent} from "../toolbar/toolbar.component";
import {CarouselComponent} from "../carousel/carousel.component";
import { SearchBarComponent } from '../search-bar/search-bar.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ToolbarComponent,
    CarouselComponent,
    SearchBarComponent,
    MatSidenavModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  opened = false;
  isFlipped = false;
}
