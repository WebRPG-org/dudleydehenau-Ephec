import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChambrePlayComponent } from './chambre-play.component';

describe('ChambrePlayComponent', () => {
  let component: ChambrePlayComponent;
  let fixture: ComponentFixture<ChambrePlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChambrePlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChambrePlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
