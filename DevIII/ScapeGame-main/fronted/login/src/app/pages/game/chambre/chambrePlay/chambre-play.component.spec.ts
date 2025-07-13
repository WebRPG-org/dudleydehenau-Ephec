import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChambrePlayComponent } from './chambre-play.component';
import { ScoreService } from '../../../../services/score-chambre.service';
import { AuthService } from '../../../../services/auth.service';
import { of } from 'rxjs';

describe('ChambrePlayComponent', () => {
  let component: ChambrePlayComponent;
  let fixture: ComponentFixture<ChambrePlayComponent>;
  let mockScoreService: ScoreService;
  let mockAuthService: AuthService;

  // Configuration initiale avant chaque test
  beforeEach(async () => {
    // Création de mocks pour les services ScoreService et AuthService
    mockScoreService = jasmine.createSpyObj<ScoreService>(['addScore']);
    mockAuthService = jasmine.createSpyObj<AuthService>(['userId'], { userId: 1 });

    // Configuration du TestBed avec le composant et les mocks
    await TestBed.configureTestingModule({
      imports: [ ChambrePlayComponent ],
      providers: [
        { provide: ScoreService, useValue: mockScoreService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
    .compileComponents();
  });

  // Création du composant avant chaque test
  beforeEach(() => {
    fixture = TestBed.createComponent(ChambrePlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test pour vérifier que le timer démarre à l'initialisation
  it('devrait démarrer le chronomètre à l\'initialisation', (done) => {
    expect(component.timer).toBe(0);
    setTimeout(() => {
      expect(component.timer).toBeGreaterThan(0);
      done();
    }, 1500);
  });

  // Test pour vérifier la soumission correcte du code
  it('devrait gérer la soumission correcte du code', () => {
    component.codeInput = '9532';
    spyOn(component, 'calculateScore');
    spyOn(component, 'addScoreToDatabase');
  
    component.submitCode();
  
    expect(component.codeCorrect).toBe(true, 'codeCorrect devrait être vrai après la soumission correcte du code');
    expect(component.calculateScore).toHaveBeenCalled();
    expect(component.addScoreToDatabase).toHaveBeenCalled();
  });

  // Test pour vérifier la soumission incorrecte du code
  it('devrait gérer la soumission incorrecte du code', () => {
    component.codeInput = '1234';
    const initialTimer = component.timer;
  
    component.submitCode();
  
    expect(component.codeCorrect).toBe(false, 'codeCorrect devrait être faux après la soumission incorrecte du code');
    expect(component.journalEntries).toContain("Code incorrect. Rien ne se passe...");
    expect(component.timer).toBeGreaterThan(initialTimer);
  });
  // Test de l'initialisation et de la destruction du composant
  it('devrait démarrer et arrêter le chronomètre correctement', () => {
    component.ngOnInit();
    expect(component.timerInterval).toBeDefined();
    component.ngOnDestroy();
    expect(component.timerInterval).toBeNull();
  });
  // Test inspection élément
  it('devrait ajouter une entrée de journal et augmenter le timer lors de l\'inspection du couteau', () => {
    const initialTimer = component.timer;
    component.inspecterCouteau();
    expect(component.journalEntries).toContain("Vous ramassez le couteau ! Vous laissez vos empreintes ");
    expect(component.timer).toBe(initialTimer + 15);
  });
  // Test fermeture de l'interface
  it('devrait fermer l\'interface de sécurité et réinitialiser le code d\'entrée', () => {
    component.codeInput = '9532';
    component.showCodeInterface = true;
    component.closeSafeInterface();
    expect(component.codeInput).toBe('');
    expect(component.showCodeInterface).toBe(false);
  });
// Test d'intégration car appelle la méthode addScore du service ScoreService => test l'intégration entre le composant et le service
  it('devrait appeler addScore du service ScoreService lorsque le score est calculé', () => {
    // Configuration du composant pour simuler le calcul d'un score
    component.codeInput = '9532';
    component.timer = 100; // par exemple
    component.codeCorrect = true;

    // Simuler l'appel de la méthode calculateScore qui devrait appeler addScore
    spyOn(component, 'calculateScore').and.callThrough();
    component.calculateScore();

    // Attendre que la promesse soit résolue
    fixture.whenStable().then(() => {
        // Vérifier si la méthode addScore du service a été appelée avec les bons arguments
        expect(mockScoreService.addScore).toHaveBeenCalledWith(1, 1, component.timer);
        //                                  niveauId  userId   scoreBTime
    });
});
});

