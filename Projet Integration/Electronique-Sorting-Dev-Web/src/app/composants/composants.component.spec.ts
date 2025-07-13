// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { ComposantsComponent } from './composants.component';

// describe('ComposantsComponent', () => {
//   let component: ComposantsComponent;
//   let fixture: ComponentFixture<ComposantsComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [ComposantsComponent],
//     }).compileComponents();

//     fixture = TestBed.createComponent(ComposantsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ComposantsComponent } from './composants.component';
import { SupabaseCRUDService } from '../services/supabaseCRUD.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';

fdescribe('ComposantsComponent', () => {
  let component: ComposantsComponent;
  let fixture: ComponentFixture<ComposantsComponent>;
  let mockSupabaseCRUDService: jasmine.SpyObj<SupabaseCRUDService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Mock du service SupabaseCRUDService
    mockSupabaseCRUDService = jasmine.createSpyObj('SupabaseCRUDService', [
      'getComponentsWithDetails',
      'getTypeComponent',
    ]);

    // Mock du Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, MatCardModule, MatChipsModule, MatGridListModule],
      declarations: [ComposantsComponent],
      providers: [
        { provide: SupabaseCRUDService, useValue: mockSupabaseCRUDService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ComposantsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch data on init', async () => {
    const mockResponse = [
      { Id: 1, Name: 'Composant 1', Type_id: 1 },
      { Id: 2, Name: 'Composant 2', Type_id: 2 },
    ];
    const mockType = { Name: 'Composant 3', Restock_value: 10 };

    mockSupabaseCRUDService.getComponentsWithDetails.and.returnValue(
      Promise.resolve(mockResponse)
    );
    mockSupabaseCRUDService.getTypeComponent.and.returnValue(
      Promise.resolve(mockType)
    );

    await component.getData();
    expect(component.data.length).toBe(2);
    expect(component.data[0].notifQuantite).toBe(10);
  });

  it('should handle empty data', async () => {
    mockSupabaseCRUDService.getComponentsWithDetails.and.returnValue(
      Promise.resolve([])
    );

    await component.getData();
    expect(component.data.length).toBe(0);
  });

  it('should navigate to modifier page', () => {
    component.changePage();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/modifier']);
  });
});
