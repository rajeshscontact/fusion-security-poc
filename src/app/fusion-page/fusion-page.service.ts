import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { AuthService } from '../auth/auth.service';


@Injectable()
export class FusionPageService {
  roles: String[];

  constructor(private service: AuthService, private http: Http) {}

  getRoles(){
    this.roles = this.service.roles;
    return this.roles;
  }

  getAccountSummary(){
    return this.http.get('/api/accountSummary')
    .map((response: Response) => {
      const accountSummary = response.json();
      return accountSummary;
    })
  }

}
