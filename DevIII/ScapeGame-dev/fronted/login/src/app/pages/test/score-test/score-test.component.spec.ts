import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { ScoreTestComponent } from './score-test.component';
import { ScoresService } from '../../../services/scores.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('ScoreTestComponent', () => {
  let component: ScoreTestComponent;
  let fixture: ComponentFixture<ScoreTestComponent>;
  let scoresServiceSpy: jasmine.SpyObj<ScoresService>;

  beforeEach(waitForAsync(() => {
    const spy = jasmine.createSpyObj('ScoresService', ['submitScore', 'getBestScore']);

    TestBed.configureTestingModule({
      imports: [ ScoreTestComponent, HttpClientTestingModule ],
      providers: [
        { provide: ScoresService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreTestComponent);
    component = fixture.componentInstance;
    scoresServiceSpy = TestBed.inject(ScoresService) as jasmine.SpyObj<ScoresService>;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit score and get best score on success', () => {
    const mockResponse = { message: 'Score submitted successfully' };
    const mockBestScore = 100;
    scoresServiceSpy.submitScore.and.returnValue(of(mockResponse));
    scoresServiceSpy.getBestScore.and.returnValue(of(mockBestScore));

    component.levelId = 1;
    component.userId = 'user1';
    component.score = 50;

    component.submitScore();

    expect(scoresServiceSpy.submitScore).toHaveBeenCalledWith(1, 'user1', 50);
    expect(component.message).toBe('Score submitted successfully');
    expect(scoresServiceSpy.getBestScore).toHaveBeenCalledWith(1, 'user1');
    expect(component.bestScore).toBe(mockBestScore);
  });

  it('should handle error on submit score', () => {
    const mockError = new Error('Submit score failed');
    scoresServiceSpy.submitScore.and.returnValue(throwError(mockError));

    component.levelId = 1;
    component.userId = 'user1';
    component.score = 50;

    component.submitScore();

    expect(scoresServiceSpy.submitScore).toHaveBeenCalledWith(1, 'user1', 50);
    expect(component.message).toBeUndefined();
  });

  it('should get best score and set bestScore on success', () => {
    const mockBestScore = 100;
    scoresServiceSpy.getBestScore.and.returnValue(of(mockBestScore));

    component.levelId = 1;
    component.userId = 'user1';

    component.getBestScore();

    expect(scoresServiceSpy.getBestScore).toHaveBeenCalledWith(1, 'user1');
    expect(component.bestScore).toBe(mockBestScore);
  });

  it('should handle error on get best score', () => {
    const mockError = new Error('Get best score failed');
    scoresServiceSpy.getBestScore.and.returnValue(throwError(mockError));

    component.levelId = 1;
    component.userId = 'user1';

    component.getBestScore();

    expect(scoresServiceSpy.getBestScore).toHaveBeenCalledWith(1, 'user1');
    expect(component.bestScore).toBeUndefined();
  });
});
