import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { TriButtonComponent } from './tri-button.component';
import { LevelService } from '../../services/search-levels.service';

describe('TriButtonComponent', () => {
  let component: TriButtonComponent;
  let fixture: ComponentFixture<TriButtonComponent>;
  let levelService: LevelService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriButtonComponent, HttpClientTestingModule],
      providers: [
        { provide: LevelService, useValue: jasmine.createSpyObj('LevelService', ['updateLevelData']) }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TriButtonComponent);
    component = fixture.componentInstance;
    levelService = TestBed.inject(LevelService);
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait trier les niveaux par likes lorsque tri est appelé avec option1', () => {
    component.tri('option1');
    expect(levelService.updateLevelData).toHaveBeenCalledWith(jasmine.any(Array));
  });

  it('devrait trier les niveaux par date de publication lorsque tri est appelé avec option2', () => {
    component.tri('option2');
    expect(levelService.updateLevelData).toHaveBeenCalledWith(jasmine.any(Array));
  });

  it('devrait trier les niveaux par vues lorsque tri est appelé avec option3', () => {
    component.tri('option3');
    expect(levelService.updateLevelData).toHaveBeenCalledWith(jasmine.any(Array));
  });

});