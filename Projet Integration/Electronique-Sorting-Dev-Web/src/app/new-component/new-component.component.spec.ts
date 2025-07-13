import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewComponentComponent } from './new-component.component';

describe('NewComponentComponent', () => {
  let component: NewComponentComponent;
  let fixture: ComponentFixture<NewComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initialisation typeComposantsListe', async () => {
    await component.getData();
    expect(component.typeComposantsListe.length).toBeGreaterThan(0);
  });
  
  it('devrais activer l input correspondant au type selectionné', () => {
    //résistance
    const event = { value: 1 }; 
    component.afficheInsertionValeur(event);
    expect(component.newValueText.resistance).toBeTrue();
    expect(component.newValueText.led).toBeFalse();
  });
  
  
});
