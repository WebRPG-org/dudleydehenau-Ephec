import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TriButtonComponent } from '../tri-button/tri-button.component';
import { Router } from '@angular/router';
import { LevelService } from '../../services/search-levels.service';

interface Level { levelId: number; levelName: string; }
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [TriButtonComponent, CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  searchTerm = '';
  searchResults: Level[] = [];

  constructor(private levelService: LevelService, private router: Router) {}

  search() {
    console.log('Search term:', this.searchTerm);
    this.levelService.searchLevels(this.searchTerm).subscribe((levels: Level[][]) => {
        if (levels.length > 0 && levels[0].length > 0) {
            console.log('First level:', levels[0][0]);
            this.goToLevel(levels[0][0]);
        }
    });
}

  goToLevel(level: Level) {
    this.router.navigate(['/game', level.levelName]);
  }
}