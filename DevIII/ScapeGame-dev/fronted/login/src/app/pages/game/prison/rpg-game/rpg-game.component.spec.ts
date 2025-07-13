import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Renderer2 } from '@angular/core';
import { RpgGameComponent } from './rpg-game.component';

describe('RpgGameComponent', () => {
  let component: RpgGameComponent;
  let fixture: ComponentFixture<RpgGameComponent>;
  let renderer2: Renderer2;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RpgGameComponent ],
      providers: [
        Renderer2
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RpgGameComponent);
    component = fixture.componentInstance;
    renderer2 = fixture.componentRef.injector.get(Renderer2);

    // Ajoutez un conteneur de jeu au DOM
    const gameContainer = document.createElement('div');
    gameContainer.id = 'rpg-game-container';
    document.body.appendChild(gameContainer);

    fixture.detectChanges();
  });

  afterEach(() => {
    // Nettoyez le DOM après chaque test
    const gameContainer = document.getElementById('rpg-game-container');
    if (gameContainer) {
      document.body.removeChild(gameContainer);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadRpgMakerGame after view init', () => {
    spyOn(component, 'loadRpgMakerGame');
    component.ngAfterViewInit();
    expect(component.loadRpgMakerGame).toHaveBeenCalled();
  });

  it('should create and append script element to game container', () => {
    const gameContainer = document.getElementById('rpg-game-container');
    spyOn(renderer2, 'selectRootElement').and.returnValue(gameContainer);
    spyOn(renderer2, 'createElement').and.callThrough();
    spyOn(renderer2, 'appendChild').and.callThrough();

    component.loadRpgMakerGame();

    expect(renderer2.selectRootElement).toHaveBeenCalledWith('#rpg-game-container');
    expect(renderer2.createElement).toHaveBeenCalledWith('script');

    const script = gameContainer!.querySelector('script')!;
    expect(script).toBeTruthy();
    expect(script.src).toContain('assets/rpg-game/index.html');
    expect(script.type).toBe('text/javascript');
  });
});
