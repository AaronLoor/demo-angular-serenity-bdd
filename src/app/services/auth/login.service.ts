import { UserRequest } from 'src/app/services/auth/userRequest';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from './loginRequest'
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  currenUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserDAta: BehaviorSubject<UserRequest> = new BehaviorSubject<UserRequest>({id:0, user:''});


  constructor(private http:HttpClient) { }

  login(credentials: LoginRequest): Observable<UserRequest[]> {
    return this.http.get<UserRequest[]>('../../../assets/data.json').pipe(
      tap((userData: UserRequest[]) => {
        const matchedUser = userData.find(user => 
          user.user === credentials.user && user.password === credentials.password
        );
        if (matchedUser) {
          this.currentUserDAta.next(matchedUser); 
          this.currenUserLoginOn.next(true);
        }
      }),
      catchError(this.handleError)
    );
  }
  
  logout(): void {
    this.currentUserDAta.next({ id: 0, user: '', email: '', password: '', message: '' });
    this.currenUserLoginOn.next(false);
    this.currentUserDAta.complete();
    this.currentUserDAta.unsubscribe();

  }
  
  



  private handleError(error:HttpErrorResponse){
    if(error.status===0){
      console.error('An error has occurred', error.status,error.error);
    }
    else{
      console.error('Backend returned the status code', error.status, error.error);
    }
    return throwError(()=> new Error('Something went wrong. Please try again'));
  }

  get userData():Observable<UserRequest>{
    return this.currentUserDAta.asObservable();
  }
  get userLoginOn():Observable<boolean>{
    return this.currenUserLoginOn.asObservable();
  }

}
