import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartesIndiceComponent } from './cartes-indice.component';

describe('CartesIndiceComponent', () => {
  let component: CartesIndiceComponent;
  let fixture: ComponentFixture<CartesIndiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartesIndiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CartesIndiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
