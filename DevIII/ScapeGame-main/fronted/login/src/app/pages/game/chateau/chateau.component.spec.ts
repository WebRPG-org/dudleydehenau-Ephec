import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChateauComponent } from './chateau.component';

describe('ChateauComponent', () => {
  let component: ChateauComponent;
  let fixture: ComponentFixture<ChateauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChateauComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChateauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
