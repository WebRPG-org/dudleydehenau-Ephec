import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreTestComponent } from './score-test.component';

describe('ScoreTestComponent', () => {
  let component: ScoreTestComponent;
  let fixture: ComponentFixture<ScoreTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScoreTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
