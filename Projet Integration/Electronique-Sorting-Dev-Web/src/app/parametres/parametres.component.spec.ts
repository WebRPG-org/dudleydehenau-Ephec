import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NewComponentComponent } from '../new-component/new-component.component';
import { SupabaseCRUDService } from '../services/supabaseCRUD.service';

import { ParametresComponent } from './parametres.component';

describe('ParametresComponent', () => {
  let component: ParametresComponent;
  let fixture: ComponentFixture<ParametresComponent>;
  let supabaseCRUDService: jasmine.SpyObj<SupabaseCRUDService>;

  beforeEach(async () => {
    const supabaseCRUDSpy = jasmine.createSpyObj('SupabaseCRUDService', [
      'updateComponent',
      'updateComponentRestock',
      'insertUser',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ParametresComponent,
        CommonModule,
        MatCardModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        FormsModule,
        NewComponentComponent
      ],
      providers: [
        { provide: SupabaseCRUDService, useValue: supabaseCRUDSpy },
      ],
    }).compileComponents();
    
    fixture = TestBed.createComponent(ParametresComponent);
    component = fixture.componentInstance;
    supabaseCRUDService = TestBed.inject(
      SupabaseCRUDService
    ) as jasmine.SpyObj<SupabaseCRUDService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  

});
