import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginService } from 'src/app/services/auth/login.service';
import { LoginRequest } from 'src/app/services/auth/loginRequest';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{
  model: any = {};

  public loginForm!: FormGroup;
  credentials:boolean =false;

  ngOnInit() {
  this.getForm();

  }
  ngOnDestroy(): void {

  }
  constructor(public formBuilder: FormBuilder,
             private router:Router,
             private loginService:LoginService,
             private messageService:MessageService
            ){}

  getForm(){
    this.loginForm = this.formBuilder.group({
      user:['',[Validators.required]],
      password:['',Validators.required],
  });

  }


  onSubmit() {
    console.log('Login form submitted:', this.model);
  }



  login() {
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value as LoginRequest).subscribe({
        next: (userDataList) => {
          const matchedUser = userDataList.find(user => 
            this.loginForm.get('user')?.value === user.user &&
            this.loginForm.get('password')?.value === user.password
          );
  
          if (matchedUser) {
            console.log(matchedUser);
            localStorage.setItem('user', this.loginForm.value.user)
            this.credentials = true;
          } else {
            this.messageService.add({
              severity: 'error', 
              summary: 'Credentials Error', 
              detail: 'Incorrect Username or Password'
            });
          }
        },
        error: (errorData) => {
          this.messageService.add({
            severity: 'error', 
            summary: 'Error', 
            detail: errorData
          });
          console.log(errorData);
        },
        complete: () => {
          if (this.credentials) {
            this.router.navigateByUrl('home');
            this.loginForm.reset();
          }
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  

}
