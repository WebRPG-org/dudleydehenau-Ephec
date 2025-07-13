import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LevelService } from './search-levels.service';

describe('LevelService', () => {
  let service: LevelService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LevelService]
    });
    service = TestBed.inject(LevelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

it('should search levels', () => {
    const mockLevels = [
        { levelId: 1, levelName: 'chambre' },
        { levelId: 2, levelName: 'chateau' }
    ];

    service.searchLevels('Level').subscribe((levels: Array<{ levelId: number, levelName: string }>) => {
        expect(levels.length).toBe(2);
        expect(levels).toEqual(mockLevels);
    });

    const req = httpMock.expectOne('http://localhost:3000/level/search?term=Level');
    expect(req.request.method).toBe('GET');
    req.flush(mockLevels);
})
});