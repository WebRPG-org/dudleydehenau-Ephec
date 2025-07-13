import { Component } from '@angular/core';
import { ScoresService } from '../../../services/scores.service';
import { FormsModule } from '@angular/forms';
import {NgForOf,CommonModule} from "@angular/common";

@Component({
  selector: 'app-score-test',
  templateUrl: './score-test.component.html',
  styleUrls: ['./score-test.component.scss'], 
  standalone: true,
  imports : [
    FormsModule,
    NgForOf,
    CommonModule
  ]
})
export class ScoreTestComponent {
  levelId!: number;
  userId!: string;
  score!: number;
  bestScore!: number;
  message!: string;

  constructor(private scoresService: ScoresService) { }

  submitScore() {
    this.scoresService.submitScore(this.levelId, this.userId, this.score).subscribe(
      response => {
        this.message = response.message;
        this.getBestScore();
      },
      error => {
        console.error('Erreur lors de la soumission du score :', error);
      }
    );
  }

  getBestScore() {
    this.scoresService.getBestScore(this.levelId, this.userId).subscribe(
      bestScore => {
        this.bestScore = bestScore;
        console.log('Meilleur score récupéré :', bestScore);
      },
      error => {
        console.error('Erreur lors de la récupération du meilleur score :', error);
      }
    );
  }
}
