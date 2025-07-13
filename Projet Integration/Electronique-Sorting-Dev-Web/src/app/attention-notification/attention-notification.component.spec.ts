import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttentionNotificationComponent } from './attention-notification.component';

describe('AttentionNotificationComponent', () => {
  let component: AttentionNotificationComponent;
  let fixture: ComponentFixture<AttentionNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttentionNotificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttentionNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
