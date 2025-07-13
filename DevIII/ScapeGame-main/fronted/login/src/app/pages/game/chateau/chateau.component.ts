import {Component, OnInit, ViewChild} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {async, Observable} from "rxjs";
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
import {RouterLink, RouterLinkActive} from "@angular/router";
import { ListKeyManager } from '@angular/cdk/a11y';


@Component({
  selector: 'app-chateau',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    NgForOf,
    MatIcon,
    MatCard,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    FormsModule,
    MatInput,
    MatButton,
    MatIconButton,
    NgIf,
    AsyncPipe,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './chateau.component.html',
  styleUrl: './chateau.component.scss'
})

export class ChateauComponent implements OnInit{
   commentaire$!: Observable<Commentaire[]>;
    userId!: User["userId"];
    levelId = 3;
    @ViewChild("formDirective") formDirective!: NgForm;
    form!: FormGroup;
    constructor(private commentaireService : CommentaireService, private authService : AuthService) { }

    ngOnInit(): void {
      this.form = this.createFormGroup();
      this.commentaire$ = this.fetchAll();
      this.userId = this.authService.userId;
    }

    likeBouton(){
      alert("Ce bouton ne fonctionne pas pour le moment.");
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

  protected readonly async = async;
}
