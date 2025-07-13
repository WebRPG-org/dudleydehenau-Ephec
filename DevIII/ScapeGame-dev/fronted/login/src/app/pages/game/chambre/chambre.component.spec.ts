import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChambreComponent } from './chambre.component';
import { CommentaireService } from '../../../services/commentaire.service';
import { AuthService } from '../../../services/auth.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from './activated-route-stub';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import ajouté

describe('ChambreComponent', () => {
  let component: ChambreComponent;
  let fixture: ComponentFixture<ChambreComponent>;
  let mockCommentaireService: jasmine.SpyObj<CommentaireService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let activatedRoute: ActivatedRouteStub;

  beforeEach(async () => {
    mockCommentaireService = jasmine.createSpyObj<CommentaireService>(['fetchAll', 'createComment', 'deleteCommentaire']);
    mockAuthService = jasmine.createSpyObj<AuthService>(['userId'], { userId: 1 });

    activatedRoute = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule, ChambreComponent], // Ajouté BrowserAnimationsModule
      providers: [
        { provide: CommentaireService, useValue: mockCommentaireService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChambreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser le formulaire correctement', () => {
    const form = component.form;
    expect(form).toBeDefined();
    expect(form.get('commentaryText')).toBeDefined();
    expect(form.get('commentaryText')?.valid).toBeFalse();
  });

  it('devrait rendre le formulaire invalide si le champ commentaryText est vide ou trop court', () => {
    const form = component.form;
    form.get('commentaryText')?.setValue('');
    expect(form.valid).toBeFalse();
    form.get('commentaryText')?.setValue('short');
    expect(form.valid).toBeFalse();
  });

  it('devrait rendre le formulaire valide avec des données valides', () => {
    const form = component.form;
    form.get('commentaryText')?.setValue('This is a valid comment.');
    expect(form.valid).toBeTrue();
  });

  it('devrait appeler delete et mettre à jour les commentaires', () => {
    spyOn(component, 'fetchAll').and.returnValue(of([]));
    mockCommentaireService.deleteCommentaire.and.returnValue(of({}));

    component.delete(1);

    expect(mockCommentaireService.deleteCommentaire).toHaveBeenCalledWith(1);
    expect(component.fetchAll).toHaveBeenCalled();
  });
});

