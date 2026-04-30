import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient, private _router: Router) {

  }

  

  logoutUser() {
    debugger;
    // sessionStorage.setItem('isLoggedIn', 'false');
    // sessionStorage.removeItem('userID');
    // sessionStorage.removeItem('password');
    // sessionStorage.removeItem('userName');
    // sessionStorage.removeItem('isAdmin');
    sessionStorage.clear();
    this._router.navigate(['/login']);
  }

 

  loggedIn() {
    var isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if(isLoggedIn == "true"){
      return true;
    }else {
      return false;
    }
    
  }

  

   

}
