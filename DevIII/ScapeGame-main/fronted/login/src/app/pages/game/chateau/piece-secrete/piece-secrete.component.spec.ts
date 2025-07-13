import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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

  it('devrait afficher ou masquer la zone de texte du code de la porte quand on clique sur envoyerCodePorte()', () => {
    component.codePorteText = 'mauvais code';
    component.envoyerCodePorte();
    expect(component.codePorteZoneTextVisible).toBeTrue();
    expect(component.flameCouloirOn).toBeFalse();

    component.envoyerCodePorte();
    expect(component.codePorteZoneTextVisible).toBeFalse();
    
    
    component.codePorteText = 'portail dimensionnel mystique';
    component.envoyerCodePorte();
    expect(component.codePorteZoneTextVisible).toBeTrue();
    expect(component.flameCouloirOn).toBeTrue();
  });


  it('devrait basculer la flamme de la porte quand on appuye sur flamePorte()', () => {
    component.flamePorte();
    expect(component.flamePorteOn).toBeTrue();
    expect(component.codePorteFlameCrane).toBe('F');

    component.flamePorte();
    expect(component.flamePorteOn).toBeFalse();
    expect(component.codePorteFlameCrane).toBe('FF');
  });


  it('devrait basculer les cartes quand on appuye sur cartes()', () => {
    component.cartes();
    expect(component.cartesOn).toBeTrue();

    component.cartes();
    expect(component.cartesOn).toBeFalse();
  });

  it('devrait réagir au clic sur la zone des cartes', () => {
    const cartesClickZone = fixture.debugElement.query(By.css('.zoneClick[style*="top: 33.7%; left: 70.5%;"]'));
    cartesClickZone.triggerEventHandler('click', null);
    expect(component.cartesOn).toBeTrue();
  });


  it('devrait basculer l"image du crane et mettre à jour le code', () => {
    component.craneTable();
    expect(component.cheminImageCrane).toBe('assets/chateau/map/objets/cranePieceSecreteD.png');
    expect(component.codePorteFlameCrane).toBe('C');

    component.craneTable();
    expect(component.cheminImageCrane).toBe('assets/chateau/map/objets/cranePieceSecreteG.png');
    expect(component.codePorteFlameCrane).toBe('CC');
  });


  it('devrait réagir au clic sur la zone du crane', () => {
    const craneClickZone = fixture.debugElement.query(By.css('.zoneClick[style*="top: 33.7%; left: 67.5%;"]'));
    craneClickZone.triggerEventHandler('click', null);
    expect(component.cheminImageCrane).toBe('assets/chateau/map/objets/cranePieceSecreteD.png');
  });


  it('devrait valider le code de la porte si on appuye sur validerCodePorte()', () => {
    component.codePorteFlameCrane = 'mauvais code';
    component.flameCouloirOn = true;

    component.validerCodePorte();
    expect(component.flameCouloirOn).toBeFalse();
    expect(component.cheminImageCrane).toBe('assets/chateau/map/objets/cranePieceSecreteG.png');
    expect(component.flamePorteOn).toBeFalse();
    expect(component.codePorteFlameCrane).toBe('');
    
    
    component.flameCouloirOn = true;
    component.codePorteFlameCrane = 'FFCFCFCCF';
    component.totalSecondesDebut = 100;

    component.validerCodePorte();
    const dateFinJeux = new Date();

    component.validerCodePorte();

    expect(component.porteOn).toBeTrue();
    expect(component.totalScore).toBe(dateFinJeux.getHours() * 3600 + dateFinJeux.getMinutes() * 60 + dateFinJeux.getSeconds() - 100); 
  });


  it('devrait afficher l"écran de score du joueur', () => {
    component.sortirChateau();
    expect(component.scoreJoueurEcranOn).toBeTrue();
  });



  it('devrait réagir au clic sur la zone du vase pour valider le code', () => {
    const vaseClickZone = fixture.debugElement.query(By.css('.zoneClick[style*="top: 44%; left: 70%;"]'));
    component.codePorteFlameCrane = 'FFCFCFCCF';
    component.flameCouloirOn = true;
    vaseClickZone.triggerEventHandler('click', null);
    expect(component.porteOn).toBeTrue();
  });


});
