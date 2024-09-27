import { Injectable } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppUser } from '../../intefaces/user.interface';
import { UserService } from '../user-service/user.service';
import { UserType } from '../../enums/user-type.enum';

@Injectable({
  providedIn: 'root'
})

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
        auth0Id: this.user.sub,
        type: UserType.CLIENT
      };
      this.userService.createUserIfDontExist(userInfo, this.token.value ).subscribe({
        next: (user: AppUser) => {
          this.loggedUser.next(user);
          localStorage.setItem("user", JSON.stringify(user));
        },
        error: (error) => {
          console.error('Erreur lors de la création de l\'utilisateur :', error);
          alert('Une erreur est survenue lors de la création de l\'utilisateur.');
        },

      });
    }
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }
}
