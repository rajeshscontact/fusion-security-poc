import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
  token: string;
  roles: any;

  constructor(private router: Router,
              private http: Http) {}

  signupUser(email: string, password: string) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch(
        error => console.log(error)
      )
  }

  signinUser(email: string, password: string) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(
        response => {
          this.router.navigate(['/']);
          firebase.auth().currentUser.getToken()
            .then(
              (token: string) => this.token = token
            )
        }
      )
      .catch(
        error => console.log(error)
      );
  }

  logout() {
    firebase.auth().signOut();
    this.token = null;
  }

  getToken() {
    firebase.auth().currentUser.getToken()
      .then(
        (token: string) => this.token = token
      );
    return this.token;
  }

  isAuthenticated() {
    return this.token != null;
  }

  signinUserPassport(email: string, password: string) {
    return this.http.post('/api/authLogin', {username: email, password: password})
      .map(res => res.json()).subscribe(
        userInfo => {
          this.router.navigate(['/']);
          this.token = userInfo.tokens.access_token;
          this.roles = userInfo.userProfile.user_metadata.roles;
        }
      );
  }

  logoutPassport() {
    return this.http.get('/api/signout').subscribe(
        response => {
          if(response.status === 200){
            this.token = null;
            this.roles = null;
            this.router.navigate(['/']);
          }
        }
      );
    // firebase.auth().signOut();
    // this.token = null;
  }
}
