import { Injectable } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppUser } from '../../intefaces/user.interface';
import { UserService } from '../user-service/user.service';

@Injectable({
  providedIn: 'root'
})

//service utilisé dans lequel on garde les infos du user et on fait la gestion de son authentification
export class AuthenticationService {
  public user: User = {};
  public loggedUser: BehaviorSubject<AppUser> = new BehaviorSubject<AppUser>({} as AppUser);
  public token: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private auth0Service: AuthService, private userService: UserService) { }

  logout() {
    localStorage.removeItem('token');
  }

  get isAuthenticated$() {
    return this.auth0Service.isAuthenticated$;
  }

  public setToken(token: string){
    this.token.next(token);
    localStorage.setItem("token", token);
    if (this.user && this.token && this.user.email && this.user.sub){
      const tempUsername = this.user.email.split('@')[0];
      const userInfo: AppUser = {
        email: this.user.email,
        firstName: this.user.given_name || "",
        lastName: this.user.family_name || "",
        username: this.user.nickname || tempUsername,
        auth0Id: this.user.sub
      };
      this.userService.createUserIfDontExist(userInfo, this.token.value ).subscribe((user: AppUser) => {
        this.loggedUser.next(user);
      });
    }
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }
}
