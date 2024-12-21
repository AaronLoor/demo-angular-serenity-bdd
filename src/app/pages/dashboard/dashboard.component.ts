import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import { LoginService } from 'src/app/services/auth/login.service';
import { UserRequest } from 'src/app/services/auth/userRequest';
import { Router } from '@angular/router';
import { configuration } from '../../application.config';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy{

  public clientForm!: FormGroup;


  userLoginOn: boolean = false;
  userData?: UserRequest;
  gender!: string[];
  maritalStatus!: string[];

    constructor(public formBuilder: FormBuilder,
      private router:Router,
      private loginService:LoginService,
      private messageService:MessageService
     ){}


  ngOnInit(): void {
    this.loginService.currenUserLoginOn.subscribe({
      next:(userLoginOn)=>{
        this.userLoginOn = userLoginOn;
      }
    });
    this.loginService.currentUserDAta.subscribe({
      next:(userData)=>{
        this.userData=userData;
      }
    });
    this.gender = configuration.gender;
    this.maritalStatus = configuration.maritalStatus;
    this.createForm();
  }
  ngOnDestroy(): void {
    this.loginService.currentUserDAta.unsubscribe();
    this.loginService.currenUserLoginOn.unsubscribe();
  }

  validate(){
    if(this.clientForm.valid){
      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Client entered correctly', life: 10000});
      this.clientForm.reset();
    }else{
      this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'The data entered is not valid. Please verify the information and try again.', life : 10000});
    }
  }

 createForm(){
  this.clientForm = this.formBuilder.group({
    name:['',Validators.required],
    lastName:['',Validators.required],
    id:['',[Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
    phone:['',[Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
    email:['',[Validators.required,Validators.email]],
    address:['',Validators.required],
    dateBirth:['',Validators.required],
    gender:['',Validators.required],
    maritalStatus:['',Validators.required]
  });
 }

}
