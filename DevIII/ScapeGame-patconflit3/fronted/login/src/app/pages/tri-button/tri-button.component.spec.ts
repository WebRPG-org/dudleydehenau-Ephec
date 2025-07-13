import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriButtonComponent } from './tri-button.component';

describe('TriButtonComponent', () => {
  let component: TriButtonComponent;
  let fixture: ComponentFixture<TriButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TriButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});