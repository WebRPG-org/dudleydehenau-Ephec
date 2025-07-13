import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreFinComponent } from './score-fin.component';

describe('ScoreFinComponent', () => {
  let component: ScoreFinComponent;
  let fixture: ComponentFixture<ScoreFinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreFinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScoreFinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
