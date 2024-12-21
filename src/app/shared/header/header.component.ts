import { LoginService } from 'src/app/services/auth/login.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserRequest } from 'src/app/services/auth/userRequest';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy{
user:any = '';
userLoginOn: boolean = false
userData?: UserRequest;
constructor(private loginService:LoginService,
            private router:Router,
){


}

  ngOnInit(): void {
    this.user = localStorage.getItem('user')? localStorage.getItem('user') : '';
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
    if (!this.userLoginOn){
      this.router.navigateByUrl('login');
    }
  }

  ngOnDestroy(): void {
    this.loginService.currentUserDAta.unsubscribe();
    this.loginService.currenUserLoginOn.unsubscribe();
  }

  singOut(){

    this.loginService.logout();
    console.log('User logout');
    this.userLoginOn=false;
    this.router.navigateByUrl('login');
  }
}
