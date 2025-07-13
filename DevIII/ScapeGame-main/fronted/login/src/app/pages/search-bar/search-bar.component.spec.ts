import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { SearchBarComponent } from './search-bar.component';
import { LevelService } from '../../services/search-levels.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let levelService: LevelService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent, HttpClientTestingModule],
      providers: [
        { 
          provide: LevelService, 
          useValue: jasmine.createSpyObj('LevelService', ['searchLevels', 'updateFilteredGames', 'updateLevelData']) // Add 'updateLevelData' here
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    levelService = TestBed.inject(LevelService);
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait appeler la fonction de recherche lorsque le bouton de recherche est cliqué', () => {
    spyOn(component, 'search');

    let button = fixture.debugElement.query(By.css('.loupe'));
    button.triggerEventHandler('click', null);

    expect(component.search).toHaveBeenCalled();
  });

  it('devrait mettre à jour les suggestions lorsque searchTerm change', () => {
    component.searchTerm = 'ch';
    component.updateSuggestions();
    expect(component.suggestions).toEqual(['chambre', 'chateau']);
  });

  it('devrait mettre à jour searchTerm et vider les suggestions lorsque selectSuggestion est appelé', () => {
    component.selectSuggestion('prison');
    expect(component.searchTerm).toEqual('prison');
    expect(component.suggestions).toEqual([]);
  });

  it('devrait appeler searchLevels avec searchTerm lorsque search est appelé', () => {
    (levelService.searchLevels as jasmine.Spy).and.returnValue(of([{ levelId: 1, levelName: 'prison' }]));
    component.searchTerm = 'prison';
    component.search();
    expect(levelService.searchLevels).toHaveBeenCalledWith('prison');
  });

  it('devrait naviguer vers la route correcte lorsque goToLevel est appelé', () => {
    spyOn((component as any).router, 'navigate');
    component.goToLevel({ levelId: 1, levelName: 'prison' });
    expect((component as any).router.navigate).toHaveBeenCalledWith(['/game', 'prison']);
  });
});
