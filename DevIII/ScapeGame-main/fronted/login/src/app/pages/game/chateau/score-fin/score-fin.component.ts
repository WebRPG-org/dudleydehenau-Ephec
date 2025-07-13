import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { ClassementService } from '../../../../services/classement.service';
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
  classement: string = '';

  constructor(private scoresService: ScoresService, private authService: AuthService, private classementService: ClassementService) {}

  ngOnInit() {
    this.submitScore();
  }

  submitScore() {
    this.scoresService.submitScore(this.levelId, this.userId, this.totalScore).subscribe(
      response => {
        console.log('Score soumis avec succès :', response);
        this.getBestScore();
        this.getClassement();
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

  getClassement() {
    this.classementService.getClassement(this.levelId).subscribe(
      classement => {
        this.classement = this.formatClassement(classement);
        console.log('Classement récupéré :', this.classement );
      },
      error => {
        console.error('Erreur lors de la récupération du classement :', error);
      }
    );
  }

  formatClassement(classement: any[]): string {

    return classement.map(score => {
      if (score.userId == this.userId) {
        return `<div>*** Votre meilleur score est de ${score.scoreBTime} secondes ***</div>`;
      } else {
        return `<div>Utilisateur: ${score.userId}, Score: ${score.scoreBTime} secondes</div>`;
      }
    }).join('');
  }

}