import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceSecreteComponent } from './piece-secrete.component';

describe('PieceSecreteComponent', () => {
  let component: PieceSecreteComponent;
  let fixture: ComponentFixture<PieceSecreteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieceSecreteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PieceSecreteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
