import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-rpg-game',
  templateUrl: './rpg-game.component.html',
  styleUrls: ['./rpg-game.component.scss']
})
export class RpgGameComponent implements OnInit, AfterViewInit {

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loadRpgMakerGame();
  }

  loadRpgMakerGame(): void {
    const gameContainer = this.renderer.selectRootElement('#rpg-game-container');
    const script = this.renderer.createElement('script');
    script.src = 'assets/rpg-game/index.html'; // Mettez le chemin correct vers le fichier principal du jeu
    script.type = 'text/javascript';
    this.renderer.appendChild(gameContainer, script);
  }
}

