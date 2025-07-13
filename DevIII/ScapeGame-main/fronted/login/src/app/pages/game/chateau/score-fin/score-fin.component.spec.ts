import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoreFinComponent } from './score-fin.component';
import { ScoresService } from '../../../../services/scores.service';
import { AuthService } from '../../../../services/auth.service';
import { ClassementService } from '../../../../services/classement.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ScoreFinComponent', () => {
  let component: ScoreFinComponent;
  let fixture: ComponentFixture<ScoreFinComponent>;
  let mockScoresService: jasmine.SpyObj<ScoresService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockClassementService: jasmine.SpyObj<ClassementService>;

  beforeEach(async () => {
    mockScoresService = jasmine.createSpyObj('ScoresService', ['submitScore', 'getBestScore']);
    mockAuthService = jasmine.createSpyObj('AuthService', [], { userId: '27' });
    mockClassementService = jasmine.createSpyObj('ClassementService', ['getClassement']);

    await TestBed.configureTestingModule({
      imports: [ ScoreFinComponent ],
      providers: [
        { provide: ScoresService, useValue: mockScoresService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ClassementService, useValue: mockClassementService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreFinComponent);
    component = fixture.componentInstance;
    component.totalScore = 100; 

    mockScoresService.submitScore.and.returnValue(of({ message: 'Score soumis' }));
    mockScoresService.getBestScore.and.returnValue(of(200));
    mockClassementService.getClassement.and.returnValue(of([{ userId: '27', scoreBTime: 150 }]));

    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait appeler submitScore() avec ngOnInit()', () => {
    spyOn(component, 'submitScore');
    component.ngOnInit();
    expect(component.submitScore).toHaveBeenCalled();
  });

  it('devrait soumettre le score lors de l"initialisation', () => {
    spyOn(component, 'getBestScore');
    spyOn(component, 'getClassement');

    component.ngOnInit();

    expect(mockScoresService.submitScore).toHaveBeenCalledWith(component.levelId, component.userId, component.totalScore);
    expect(component.getBestScore).toHaveBeenCalled();
    expect(component.getClassement).toHaveBeenCalled();
  });

  it('devrait récupérer le meilleur score', () => {
    const bestScore = 20;
    mockScoresService.getBestScore.and.returnValue(of(bestScore));

    component.getBestScore();

    expect(mockScoresService.getBestScore).toHaveBeenCalledWith(component.levelId, component.userId);
    expect(component.bestScore).toBe(bestScore);
  });

  it('devrait récupérer le classement', () => {
    const classementTest = [
      { userId: '101', scoreBTime: 14 },
      { userId: '27', scoreBTime: 111 },
      { userId: '3', scoreBTime: 450 },
    ];
    mockClassementService.getClassement.and.returnValue(of(classementTest));

    component.getClassement();

    expect(mockClassementService.getClassement).toHaveBeenCalledWith(component.levelId);
    expect(component.classement).toContain(`<div>Utilisateur: 101, Score: 14 secondes</div><div>*** Votre meilleur score est de 111 secondes ***</div><div>Utilisateur: 3, Score: 450 secondes</div>`);
  });

  it('devrait mettre le classement au bon format', () => {
    const classementResponse = [
      { userId: '27', scoreBTime: 111 },
      { userId: '4', scoreBTime: 900 }
    ];
    const formattedClassement = component.formatClassement(classementResponse);

    expect(formattedClassement).toBe(`<div>*** Votre meilleur score est de 111 secondes ***</div><div>Utilisateur: 4, Score: 900 secondes</div>`);
  });
});
