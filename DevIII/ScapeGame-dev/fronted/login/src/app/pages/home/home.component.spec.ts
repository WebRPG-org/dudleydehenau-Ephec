import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HomeComponent } from './home.component';
import { LevelService } from '../../services/search-levels.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpMock: HttpTestingController;
  let levelService: LevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HomeComponent, NoopAnimationsModule],
      providers: [LevelService]
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    levelService = TestBed.inject(LevelService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should filter games correctly', () => {
    const mockGames = [
      { difficulty: 1, theme: 'jeux-video' },
      { difficulty: 2, theme: 'casse-tete' },
      { difficulty: 3, theme: 'culture' },
      { difficulty: 4, theme: 'dev' },
      { difficulty: 5, theme: 'jeux-video' },
    ];

    spyOn(levelService, 'updateFilteredGames');
    spyOn(levelService, 'updateLevelData');

    component.filterGames();

    const req = httpMock.expectOne('http://localhost:3000/level/data');
    expect(req.request.method).toBe('GET');
    req.flush(mockGames);

    expect(component.games).toEqual(mockGames);
    expect(levelService.updateFilteredGames).toHaveBeenCalled();
    expect(levelService.updateLevelData).toHaveBeenCalled();
  });
});