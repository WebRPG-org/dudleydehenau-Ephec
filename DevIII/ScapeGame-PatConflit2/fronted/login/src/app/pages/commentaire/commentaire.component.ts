import {Component, OnInit, Output, ViewChild,EventEmitter} from '@angular/core';
import {FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators} from "@angular/forms";
import {Commentaire} from "../../models/Commentaire";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatLabel} from "@angular/material/form-field";
import {CommentaireService} from "../../services/commentaire.service";
import {AuthService} from "../../services/auth.service";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-commentaire',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatButton,
    MatLabel,
  ],
  templateUrl: './commentaire.component.html',
  styleUrl: './commentaire.component.scss'
})
export class CommentaireComponent implements OnInit{
  @ViewChild("formDirective") formDirective!: NgForm;
  @Output() create : EventEmitter<any> = new EventEmitter();
  form!: FormGroup;

  constructor(private commentaireService: CommentaireService,private authService : AuthService ) { }


  ngOnInit(): void {
    this.form = this.createFormGroup();
  }

  createFormGroup() {
    return new FormGroup({
      commentaire: new FormControl('', [Validators.required, Validators.minLength(10)]),
    });
  }


  onSubmit(formData:Pick<Commentaire,"commentaire">) {
    this.commentaireService
      .createComment(formData, this.authService.userId)
      .pipe(first())
      .subscribe(() => {
        this.create.emit(null);
      });
    this.create.emit(null);
    this.form.reset();
    this.formDirective.resetForm();

  }
}
