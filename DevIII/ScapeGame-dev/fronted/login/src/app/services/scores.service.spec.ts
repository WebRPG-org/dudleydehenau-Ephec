import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ScoresService } from './scores.service';

describe('ScoresService', () => {
  let service: ScoresService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ScoresService]
    });
    service = TestBed.inject(ScoresService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should submit score and update best score if it is lower', () => {
    const levelId = 1;
    const userId = 'user1';
    const score = 50;
    const mockBestScore = 100;
    const mockResponse = { message: 'Score updated successfully' };

    service.submitScore(levelId, userId, score).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req1 = httpMock.expectOne(`${service['apiUrl']}/best/${userId}/${levelId}`);
    expect(req1.request.method).toBe('GET');
    req1.flush({ bestScore: mockBestScore });

    const req2 = httpMock.expectOne(`${service['apiUrl']}/update`);
    expect(req2.request.method).toBe('PUT');
    expect(req2.request.body).toEqual({ levelId, userId, score });
    req2.flush(mockResponse);
  });

  it('should not update score if it is higher than the best score', () => {
    const levelId = 1;
    const userId = 'user1';
    const score = 150;
    const mockBestScore = 100;
    const mockResponse = { message: 'Score not updated, it is not the best score.' };

    service.submitScore(levelId, userId, score).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/best/${userId}/${levelId}`);
    expect(req.request.method).toBe('GET');
    req.flush({ bestScore: mockBestScore });

    httpMock.expectNone(`${service['apiUrl']}/update`);
  });

  it('should handle error on submit score', () => {
    const levelId = 1;
    const userId = 'user1';
    const score = 50;
    const mockError = new ErrorEvent('Network error');

    service.submitScore(levelId, userId, score).subscribe(
      response => fail('expected an error, not a response'),
      (error: HttpErrorResponse) => expect(error.error).toEqual(mockError)
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/best/${userId}/${levelId}`);
    expect(req.request.method).toBe('GET');
    req.error(mockError);
  });

  it('should get best score', () => {
    const levelId = 1;
    const userId = 'user1';
    const mockBestScore = 100;

    service.getBestScore(levelId, userId).subscribe(bestScore => {
      expect(bestScore).toBe(mockBestScore);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/best/${userId}/${levelId}`);
    expect(req.request.method).toBe('GET');
    req.flush({ bestScore: mockBestScore });
  });

  it('should handle error on get best score', () => {
    const levelId = 1;
    const userId = 'user1';
    const mockError = new ErrorEvent('Network error');

    service.getBestScore(levelId, userId).subscribe(
      bestScore => fail('expected an error, not a best score'),
      (error: HttpErrorResponse) => expect(error.error).toEqual(mockError)
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/best/${userId}/${levelId}`);
    expect(req.request.method).toBe('GET');
    req.error(mockError);
  });
});
