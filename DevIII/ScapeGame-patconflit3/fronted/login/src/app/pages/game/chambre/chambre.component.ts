import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormField} from "@angular/material/form-field";
import {FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from '@angular/forms'
import {MatInputModule} from '@angular/material/input';
import {MatButton, MatIconButton} from "@angular/material/button";
import {CommentaireService} from "../../../services/commentaire.service";
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../models/User";
import {Commentaire} from "../../../models/Commentaire";
import {MatCard} from "@angular/material/card";
import {NgForOf,CommonModule} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {first} from "rxjs/operators";
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-chambre',
  standalone: true,
  imports: [MatGridListModule, MatFormField, FormsModule, MatInputModule, MatButton, ReactiveFormsModule, MatCard, NgForOf, CommonModule, MatIcon, MatIconButton, RouterLink, RouterLinkActive],
  templateUrl: './chambre.component.html',
  styleUrl: './chambre.component.scss'
})
export class ChambreComponent implements OnInit{
    commentaire$!: Observable<Commentaire[]>;
    userId!: User["userId"];
    levelId = 1;
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
}
