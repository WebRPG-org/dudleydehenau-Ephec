import {Component, OnInit, ViewChild} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Observable} from "rxjs";
import {Commentaire} from "../../../models/Commentaire";
import {User} from "../../../models/User";
import {FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommentaireService} from "../../../services/commentaire.service";
import {AuthService} from "../../../services/auth.service";
import {first} from "rxjs/operators";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-hopital',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    NgForOf,
    AsyncPipe,
    FormsModule,
    MatButton,
    MatCard,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './hopital.component.html',
  styleUrl: './hopital.component.scss'
})
export class HopitalComponent implements OnInit{
   commentaire$!: Observable<Commentaire[]>;
    userId!: User["userId"];
    levelId = 5;
    @ViewChild("formDirective") formDirective!: NgForm;
    form!: FormGroup;
    constructor(private commentaireService : CommentaireService, private authService : AuthService) { }

    ngOnInit(): void {
      this.form = this.createFormGroup();
      this.commentaire$ = this.fetchAll();
      this.userId = this.authService.userId;
    }

   createFormGroup() {
      return new FormGroup({
        commentaryText: new FormControl('', [Validators.required, Validators.minLength(10)]),
      });
    }
    onSubmit(formData:Pick<Commentaire,"commentaryText">) {
      this.commentaireService
        .createComment(formData, this.authService.userId, this.levelId)
        .pipe(first())
        .subscribe(() => {
          this.createComment()
        });
      this.createComment()
      this.form.reset();
      this.formDirective.resetForm();
    }
    fetchAll(): Observable<Commentaire[]>{
      return this.commentaireService.fetchAll(this.levelId);
    }

    createComment() {
      this.commentaire$ = this.fetchAll();
    }

    delete(commentaireId: Commentaire["userId"]){
      this.commentaireService.deleteCommentaire(commentaireId)
        .subscribe(() => (this.commentaire$ = this.fetchAll()));
    }

    jeuxIndisponib() {
      alert("Le jeu n'est pas encore disponible.");
    }

    likeBouton(){
      alert("Ce bouton ne fonctionne pas pour le moment.");
    }
}

