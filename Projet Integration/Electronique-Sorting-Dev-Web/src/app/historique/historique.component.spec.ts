import { TestBed } from '@angular/core/testing';
import { HistoriqueComponent } from './historique.component';
import { SupabaseCRUDService } from '../services/supabaseCRUD.service';
import { of, throwError } from 'rxjs';

describe('HistoriqueComponent', () => {
  let component: HistoriqueComponent;
  let serviceMock: jasmine.SpyObj<SupabaseCRUDService>;

  beforeEach(async () => {
    const mockSupabaseCRUDService = jasmine.createSpyObj('SupabaseCRUDService', [
      'getHistoric',
      'getComponentsWithDetails'
    ]);

    await TestBed.configureTestingModule({
      declarations: [HistoriqueComponent],
      providers: [{ provide: SupabaseCRUDService, useValue: mockSupabaseCRUDService }]
    }).compileComponents();

    serviceMock = TestBed.inject(SupabaseCRUDService) as jasmine.SpyObj<SupabaseCRUDService>;
    component = TestBed.createComponent(HistoriqueComponent).componentInstance;
  });

  // Test de base : Initialisation
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Test de fetchHistoricElements : Cas de succès
  it('should fetch and map historic elements correctly', async () => {
    const mockData = [
      { id: 1, date: '2024-01-01', action: 'Ajout', component_id: 10, counter: 5 },
      { id: 2, date: '2024-01-02', action: 'Suppression', component_id: 20, counter: 3 }
    ];
    serviceMock.getHistoric.and.returnValue(Promise.resolve(mockData));

    await component.fetchHistoricElements();

    expect(component.historicElements.length).toBe(2);
    expect(component.historicElements[0].action).toBe('Ajout');
    expect(component.historicElements[1].component_id).toBe(20);
    expect(serviceMock.getHistoric).toHaveBeenCalled();
  });

  // Test de fetchHistoricElements : Cas d'erreur
  it('should handle errors during fetchHistoricElements', async () => {
    serviceMock.getHistoric.and.returnValue(Promise.reject('API Error'));

    await component.fetchHistoricElements();

    expect(component.historicElements.length).toBe(0); // Aucun élément ajouté
  });

  // Test de groupHistoricElementsByDate
  it('should group historic elements by normalized date', () => {
    component.historicElements = [
      { id: 1, date: new Date('2024-01-01'), action: 'Ajout', component_id: 10, counter: 5 },
      { id: 2, date: new Date('2024-01-01'), action: 'Suppression', component_id: 20, counter: 3 },
      { id: 3, date: new Date('2024-01-02'), action: 'Ajout', component_id: 30, counter: 2 }
    ];

    component.groupHistoricElementsByDate();

    expect(component.groupedHistoricElements.length).toBe(2);
    expect(component.groupedHistoricElements[0].elements.length).toBe(2); // Deux éléments le 2024-01-01
    expect(component.groupedHistoricElements[1].elements.length).toBe(1); // Un élément le 2024-01-02
  });

  // Test de getData : Cas de succès
  it('should fetch and set component data correctly', async () => {
    const mockComponents = [
      { Id: 1, Type: { Name: 'Résistance' }, Feature: { Description: '100 Ohm', Image: 'resistance.png' } },
      { Id: 2, Type: { Name: 'Condensateur' }, Feature: { Description: '10uF', Image: 'capacitor.png' } }
    ];
    serviceMock.getComponentsWithDetails.and.returnValue(Promise.resolve(mockComponents));

    await component.getData();

    expect(component.data.length).toBe(2);
    expect(component.data[0].Type.Name).toBe('Résistance');
    expect(serviceMock.getComponentsWithDetails).toHaveBeenCalled();
  });

  // Test de getData : Cas d'erreur
  it('should handle errors during getData', async () => {
    serviceMock.getComponentsWithDetails.and.returnValue(Promise.reject('API Error'));

    await component.getData();

    expect(component.data.length).toBe(0); // Aucune donnée ajoutée
  });

  // Test de getComponents
  it('should return correct component name for a valid ID', () => {
    component.data = [
      { Id: 1, Type: { Name: 'Résistance' } },
      { Id: 2, Type: { Name: 'Condensateur' } }
    ];

    expect(component.getComponents(1)).toBe('Résistance');
    expect(component.getComponents(99)).toBe('Composant inconnu (ID: 99)');
  });

  // Test de getName
  it('should return correct component description for a valid ID', () => {
    component.data = [
      { Id: 1, Feature: { Description: '100 Ohm' } },
      { Id: 2, Feature: { Description: '10uF' } }
    ];

    expect(component.getName(1)).toBe('100 Ohm');
    expect(component.getName(99)).toBe('Description Inconnue (ID: 99)');
  });

  // Test de getImage
  it('should return correct component image for a valid ID', () => {
    component.data = [
      { Id: 1, Feature: { Image: 'resistance.png' } },
      { Id: 2, Feature: { Image: 'capacitor.png' } }
    ];

    expect(component.getImage(1)).toBe('resistance.png');
    expect(component.getImage(99)).toBe('Image Inconnue (ID: 99)');
  });

  // Test de getAction
  it('should return correct action label', () => {
    expect(component.getAction('Ajout')).toBe('Ajout');
    expect(component.getAction('Suppression')).toBe('Suppression');
    expect(component.getAction('Triage')).toBe('Tri');
    expect(component.getAction('Autre')).toBe('Action inconnue');
  });

  // Test de toggleShowMore
  it('should toggle showMore property', () => {
    expect(component.showMore).toBe(false);
    component.toggleShowMore();
    expect(component.showMore).toBe(true);
    component.toggleShowMore();
    expect(component.showMore).toBe(false);
  });

  // Test de isTextTooLong
  it('should return true for text longer than 100 characters', () => {
    const shortText = 'Short text';
    const longText = 'a'.repeat(101);

    expect(component.isTextTooLong(shortText)).toBe(false);
    expect(component.isTextTooLong(longText)).toBe(true);
  });
});



