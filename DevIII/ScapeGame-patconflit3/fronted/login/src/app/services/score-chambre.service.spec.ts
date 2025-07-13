import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ScoreService } from './score-chambre.service';

describe('ScoreService', () => {
  let service: ScoreService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ScoreService]
    });
    service = TestBed.inject(ScoreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to add a score', () => {
    const dummyScore = { levelId: 1, userId: 1, scoreBTime: 100 };

    service.addScore(dummyScore.levelId, dummyScore.userId, dummyScore.scoreBTime).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/score/scores');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyScore);
  });
});
