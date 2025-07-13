import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapChateauComponent } from './map-chateau.component';

describe('MapChateauComponent', () => {
  let component: MapChateauComponent;
  let fixture: ComponentFixture<MapChateauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapChateauComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MapChateauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
