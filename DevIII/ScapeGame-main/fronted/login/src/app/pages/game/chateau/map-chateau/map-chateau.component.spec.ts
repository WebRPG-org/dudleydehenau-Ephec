import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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


  it('devrait mettre laveOn à true quand lave() est appelé', () => {
    component.lave();
    expect(component.laveOn).toBe(true);
  });

  it('devrait afficher l"image quand laveOn est true', () => {
    component.laveOn = true;
    fixture.detectChanges();
    const img = fixture.debugElement.query(By.css('img[alt="image lave"]'));
    expect(img).toBeTruthy();
  });

  it('devrait mettre coffreOn à true quand cle() est appelé', () => {
    component.cle();
    expect(component.coffreOn).toBe(true);
  });

  it('devrait changer le boolean alphabetOn quand coffreOuvert() est appelé et coffreOn est true', () => {
    component.coffreOn = false;
    component.alphabetOn = false;

    component.coffreOuvert();
    expect(component.alphabetOn).toBe(false);
    
    component.coffreOn = true;

    component.coffreOuvert();
    expect(component.alphabetOn).toBe(true);

    component.coffreOuvert();
    expect(component.alphabetOn).toBe(false);
  });


  //test sur les cranes 
  it('devrait changer le boolean craneTableDroiteOn quand tableDroite() est appelé', () => {
    const initialCraneTableDroiteOn = component.craneTableDroiteOn;
    component.tableDroite();
    expect(component.craneTableDroiteOn).toBe(!initialCraneTableDroiteOn);
  });

  it('devrait changer le boolean cheminImageTableDroite et craneTD quand craneTablDroitClick() est appelé', () => {
    component.craneTablDroitClick();
    expect(component.cheminImageTableDroite).toBe('assets/chateau/map/objets/craneTableDroitG.png');
    expect(component.craneTD).toBe(true);

    component.craneTablDroitClick();
    expect(component.cheminImageTableDroite).toBe('assets/chateau/map/objets/craneTableDroitD.png');
    expect(component.craneTD).toBe(false);
  });

  it('devrait appeler craneTablDroitClick() quand le bon <div> est cliqué', () => {
    spyOn(component, 'craneTablDroitClick');
    const div = fixture.debugElement.query(By.css('div[style*="top: 50%; left: 57.5%;"]'));
    div.triggerEventHandler('click', null);
    expect(component.craneTablDroitClick).toHaveBeenCalled();
  });

  it('devrait basculer cheminImageTableGauche et craneTG lorsque craneTablGaucheClick est appelé', () => {
    spyOn(component, 'checkSecretRoom');

    component.cheminImageTableGauche = "assets/chateau/map/objets/craneTableGaucheD.png";
    component.craneTG = true;

    component.craneTablGaucheClick();
    expect(component.cheminImageTableGauche).toBe('assets/chateau/map/objets/craneTableGaucheG.png');
    expect(component.craneTG).toBe(false);
    expect(component.checkSecretRoom).toHaveBeenCalled();

    component.craneTablGaucheClick();
    expect(component.cheminImageTableGauche).toBe('assets/chateau/map/objets/craneTableGaucheD.png');
    expect(component.craneTG).toBe(true);
    expect(component.checkSecretRoom).toHaveBeenCalledTimes(2);
  });

  it('devrait basculer cheminImageLivre et craneL lorsque craneLivreClick est appelé', () => {
    spyOn(component, 'checkSecretRoom');

    component.cheminImageLivre = "assets/chateau/map/objets/craneLivreG.png";
    component.craneL = false;

    component.craneLivreClick();
    expect(component.cheminImageLivre).toBe('assets/chateau/map/objets/craneLivreD.png');
    expect(component.craneL).toBe(true);
    expect(component.checkSecretRoom).toHaveBeenCalled();

    component.craneLivreClick();
    expect(component.cheminImageLivre).toBe('assets/chateau/map/objets/craneLivreG.png');
    expect(component.craneL).toBe(false);
    expect(component.checkSecretRoom).toHaveBeenCalledTimes(2);
  });


  //pièce secrete tests
  it('devrait activer pieceSecreteOn lorsque pieceSecrete est appelé et porteSecreteOuverte est true', () => {
    component.porteSecreteOuverte = true;
    component.pieceSecreteOn = false;

    component.pieceSecrete();
    expect(component.pieceSecreteOn).toBe(true);
  });

  it('ne devrait pas activer pieceSecreteOn lorsque pieceSecrete est appelé et porteSecreteOuverte est false', () => {
    component.porteSecreteOuverte = false;
    component.pieceSecreteOn = false;

    component.pieceSecrete();
    expect(component.pieceSecreteOn).toBe(false);
  });

  it('devrait afficher app-piece-secrete quand pieceSecreteOn est true', () => {
    component.pieceSecreteOn = true;
    fixture.detectChanges();
    const pieceSecrete = fixture.debugElement.query(By.css('app-piece-secrete'));
    expect(pieceSecrete).toBeTruthy();
  });
  


  it('should toggle carnetOn when the corresponding div is clicked', () => {
    const initialCarnetOn = component.carnetOn;
    const div = fixture.debugElement.query(By.css('div[style*="top: 38%; left: 42.5%;"]'));
    div.triggerEventHandler('click', null);
    expect(component.carnetOn).toBe(!initialCarnetOn);
  });


  it('devrait basculer carnetOn lorsque carnet est appelé', () => {
    const initialCarnetOn = component.carnetOn;

    component.carnet();
    expect(component.carnetOn).toBe(!initialCarnetOn);

    component.carnet();
    expect(component.carnetOn).toBe(initialCarnetOn);
  });



  it('devrait activer flamePorteOn et porteSecreteOuverte lorsque checkSecretRoom est appelé avec les bonnes conditions', () => {
    component.craneL = true;
    component.craneTG = true;
    component.craneTD = true;

    component.checkSecretRoom();
    expect(component.flamePorteOn).toBe(true);
    expect(component.porteSecreteOuverte).toBe(true);
  });

  it('ne devrait pas activer flamePorteOn et porteSecreteOuverte lorsque checkSecretRoom est appelé sans les bonnes conditions', () => {
    component.craneL = true;
    component.craneTG = true;
    component.craneTD = false;

    component.checkSecretRoom();
    expect(component.flamePorteOn).toBe(false);
    expect(component.porteSecreteOuverte).toBe(false);

    component.craneL = true;
    component.craneTG = false;
    component.craneTD = false;

    component.checkSecretRoom();
    expect(component.flamePorteOn).toBe(false);
    expect(component.porteSecreteOuverte).toBe(false);
  });



  it('devrait activer osGauche lorsque monstreGauche est appelé', () => {
    component.osGauche = false;

    component.monstreGauche();
    expect(component.osGauche).toBe(true);

    component.monstreGauche();
    expect(component.osGauche).toBe(true);
  });


  it('devrait activer osDroit lorsque monstreDroit est appelé', () => {
    component.osDroit = false;

    component.monstreDroit();
    expect(component.osDroit).toBe(true);

    component.monstreDroit();
    expect(component.osDroit).toBe(true);
  });

  it('devrait basculer osMystique lorsque osIndice est appelé', () => {
    const initialOsMystique = component.osMystique;

    component.osIndice();
    expect(component.osMystique).toBe(!initialOsMystique);

    component.osIndice();
    expect(component.osMystique).toBe(initialOsMystique);
  });

  it('devrait basculer osCode lorsque osIndiceCode est appelé', () => {
    const initialOsCode = component.osCode;

    component.osIndiceCode();
    expect(component.osCode).toBe(!initialOsCode);

    component.osIndiceCode();
    expect(component.osCode).toBe(initialOsCode);
  });

  it('devrait activer osCleCoffre lorsque osCle est appelé', () => {
    component.osCleCoffre = false;

    component.osCle();
    expect(component.osCleCoffre).toBe(true);
  });


  it('devrait initialiser les propriétés correctement dans le constructeur', () => {
    const nouveauJeux = new MapChateauComponent();

    expect(nouveauJeux.tempsDepart).toBeDefined();
    expect(nouveauJeux.heure).toBe(nouveauJeux.tempsDepart.getHours());
    expect(nouveauJeux.minutes).toBe(nouveauJeux.tempsDepart.getMinutes());
    expect(nouveauJeux.secondes).toBe(nouveauJeux.tempsDepart.getSeconds());
    expect(nouveauJeux.totalSecondesDebut).toBe(
      (nouveauJeux.heure * 3600) + (nouveauJeux.minutes * 60) + nouveauJeux.secondes
    );
  });

});
