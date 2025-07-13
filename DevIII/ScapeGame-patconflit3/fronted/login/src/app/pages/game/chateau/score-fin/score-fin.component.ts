import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { ScoresService } from '../../../../services/scores.service';

@Component({
  selector: 'app-score-fin',
  standalone: true,
  imports: [],
  templateUrl: './score-fin.component.html',
  styleUrl: './score-fin.component.scss'
})
export class ScoreFinComponent implements OnInit {

  @Input()
  totalScore!: number;

  levelId = 3;
  userId = this.authService.userId.toString();
  bestScore!: number;
  message!: string;

  constructor(private scoresService: ScoresService, private authService: AuthService) {}

  ngOnInit() {
    this.submitScore();
  }

  submitScore() {
    this.scoresService.submitScore(this.levelId, this.userId, this.totalScore).subscribe(
      response => {
        console.log('Score soumis avec succès :', response);
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
