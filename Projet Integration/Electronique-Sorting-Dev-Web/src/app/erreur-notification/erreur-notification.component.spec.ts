import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErreurNotificationComponent } from './erreur-notification.component';

describe('ErreurNotificationComponent', () => {
  let component: ErreurNotificationComponent;
  let fixture: ComponentFixture<ErreurNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErreurNotificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErreurNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
