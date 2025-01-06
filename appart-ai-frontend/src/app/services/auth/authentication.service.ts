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

  constructor(private auth0Service: AuthService, private userService: UserService) {
    this.auth0Service.user$.subscribe(user => {
      this.user = user || {};
      if (user?.email && user?.sub) {
        const tempUsername = user.email.split('@')[0];
        const userInfo: AppUser = {
          email: user.email,
          firstName: user.given_name || "",
          lastName: user.family_name || "",
          username: user.nickname || tempUsername,
          auth0Id: user.sub,
          type: UserType.CLIENT,
        };
        this.userService.createUserIfDontExist(userInfo).subscribe({
          next: (user: AppUser) => {
            this.loggedUser.next(user);
          },
          error: (error) => console.error("Error creating user:", error),
        });
      }
    });
   }

  logout() {
    this.auth0Service.logout();
    window.location.href = window.location.origin;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.loggedUser.next({} as AppUser);
  }
  
  get isAuthenticated$() {
    return this.auth0Service.isAuthenticated$;
  }

}
