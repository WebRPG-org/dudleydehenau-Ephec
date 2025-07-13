import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField} from "@angular/material/form-field";
import {MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {AuthService} from "../../services/auth.service";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButton, MatFormField, MatInput, MatLabel, ReactiveFormsModule, RouterLinkActive, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.loginForm = this.createFormGroup();
  }

  createFormGroup() {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      userPassword: new FormControl('', [Validators.required, Validators.minLength(7)])
    });
  }
  login() {
    this.authService.login(this.loginForm.value.email, this.loginForm.value.userPassword).subscribe();

  }

}
