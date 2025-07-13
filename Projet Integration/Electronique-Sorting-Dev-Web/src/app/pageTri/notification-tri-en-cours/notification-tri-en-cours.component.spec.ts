import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTriEnCoursComponent } from './notification-tri-en-cours.component';

describe('NotificationTriEnCoursComponent', () => {
  let component: NotificationTriEnCoursComponent;
  let fixture: ComponentFixture<NotificationTriEnCoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationTriEnCoursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotificationTriEnCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
