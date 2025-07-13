import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScoreService } from '../../../../services/score-chambre.service';
import { Injectable } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-chambre-play',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chambre-play.component.html',
  styleUrl: './chambre-play.component.scss'
})

@Injectable({
  providedIn: 'root'
})

export class ChambrePlayComponent implements OnInit {
  codeInput: string = ''; 
  currentTime: string = '';
  timer: number = 0;
  timerInterval: any;
  codeCorrect: boolean = false;
  score: number = 0;
  showCodeInterface: boolean = false;
  codeColors: string[] = [];

  constructor(private scoreService: ScoreService, private authService: AuthService) { }

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (!this.codeCorrect) {
        this.timer++;
      }
    }, 1000); 
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval); 
    this.timerInterval = null;
  }

  formatTimer(time: number) {
    let hours: number = Math.floor(time / 3600);
    let minutes: number = Math.floor((time % 3600) / 60);
    let seconds: number = time % 60;
  
    let hoursDisplay = hours < 10 ? '0' + hours : hours;
    let minutesDisplay = minutes < 10 ? '0' + minutes : minutes;
    let secondsDisplay = seconds < 10 ? '0' + seconds : seconds;
  
    return `${hoursDisplay}:${minutesDisplay}:${secondsDisplay}`;
  }

  journalEntries: string[] = [];

  inspecterCouteau(): void {
    const action = "Vous ramassez le couteau ! Vous laissez vos empreintes ";
    this.journalEntries.push(action);
    this.timer += 15;
  }

  inspecterHorloge(): void {
    const action = "3";
    this.journalEntries.push(action);
  }

  inspecterTele() {
    const action = "🔴\n🟢\n🔵\n🟡"; 

    this.journalEntries.push(action);
  }

  moveFenetre() {
    const action = "9";
    this.journalEntries.push(action);
  }
  openCoffre() {
    const action = "Vous ouvrez le coffre...";
    this.journalEntries.push(action);
    this.showCodeInterface = true; 
  }

  openCadre() {
    const action = "5"; 
    this.journalEntries.push(action); 
  }

  openLampe() {
    const action = "2";
    this.journalEntries.push(action);
  }

  openNeuf() {
    const actionRed = "🔴"; 
    this.journalEntries.push(actionRed);
  }

  openDeux() {
    const actionYellow = "🟡"; 
    this.journalEntries.push(actionYellow);
  }

  openCinq() {
    const actionGreen = "🟢";  
    this.journalEntries.push(actionGreen);
  }

  openTrois() {
    const actionBlue = "🔵";  
    this.journalEntries.push(actionBlue);
  }

  submitCode() {
    console.log("Code soumis :", this.codeInput);
    
    if (this.codeInput === '9532') {
      this.codeCorrect = true;
      clearInterval(this.timerInterval); 

      this.calculateScore();

      this.addScoreToDatabase();

      const action = `Bravo ! Le code du coffre est bon. Votre score de partie est de ${this.score}`;
      this.journalEntries.push(action);
      
    } else {
      const action = "Code incorrect. Rien ne se passe...";
      this.journalEntries.push(action);
      this.timer += 30;
     
    }
    this.codeInput = '';
    //this.codeCorrect = false;
  }

  calculateScore() {
    const maxTime = 30 * 60; 
    const maxScore = 1000; 
    
    
    this.score = Math.floor(maxScore * (1 - this.timer / maxTime));
  
    
    if (this.score > maxScore) {
      this.score = maxScore;
    }
  }
  

  closeSafeInterface() {
    this.showCodeInterface = false;
    this.codeInput = ''; 
  }

  addScoreToDatabase() {
    const levelId = 1;
    const userId = this.authService.userId;
    const scoreBTime = this.score;

    console.log('Valeurs envoyées au service :', { levelId, userId, scoreBTime });

    this.scoreService.addScore(levelId, userId, scoreBTime).subscribe(
      (response) => {
        console.log('Score ajouté avec succès :', response);
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du score :', error);
      }
    );
  }
}