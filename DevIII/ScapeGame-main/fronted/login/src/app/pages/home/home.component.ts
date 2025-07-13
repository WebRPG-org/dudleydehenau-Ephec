import { Component} from '@angular/core';
import {ToolbarComponent} from "../toolbar/toolbar.component";
import {CarouselComponent} from "../carousel/carousel.component";
import {GridComponent} from "../grid/grid.component";
import { SearchBarComponent } from '../search-bar/search-bar.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { LevelService } from '../../services/search-levels.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ToolbarComponent,
    CarouselComponent,
    GridComponent,
    SearchBarComponent,
    MatSidenavModule,
    MatCheckboxModule,
    MatIconModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  opened = false;
  isFlipped = false;
  games: any[] = [];

  constructor(private levelService: LevelService, private http: HttpClient) {};

  facile = true;
  moyen = true;
  difficile = true;
  extreme = true;
  jeuxVideos = true;
  casseTetes = true;
  culture = true;
  dev = true;

  ngOnInit(): void {
    this.filterGames();
    
}

  filterGames() {
    this.http.get<any>('http://localhost:3000/level/data').subscribe((data: Array<any>) => {
      this.games = data;
      this.levelService.filteredGames = this.games.filter(game =>
        ((this.facile && game.difficulty === 1) ||
        (this.moyen && game.difficulty === 2) ||
        (this.difficile && (game.difficulty === 3 || game.difficulty === 4)) ||
        (this.extreme && game.difficulty === 5)) ||
        ((this.jeuxVideos && game.theme === 'jeux-video') ||
        (this.casseTetes && game.theme === 'casse-tete') ||
        (this.culture && game.theme === 'culture') ||
        (this.dev && game.theme === 'dev'))
      );
      this.levelService.updateFilteredGames(this.levelService.filteredGames);
      this.levelService.updateLevelData(this.levelService.filteredGames);
    });
  }
}
