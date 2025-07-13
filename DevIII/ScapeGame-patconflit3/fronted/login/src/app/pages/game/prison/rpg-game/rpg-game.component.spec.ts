import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpgGameComponent } from './rpg-game.component';

describe('RpgGameComponent', () => {
  let component: RpgGameComponent;
  let fixture: ComponentFixture<RpgGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RpgGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RpgGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
