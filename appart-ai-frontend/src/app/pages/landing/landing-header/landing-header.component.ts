import { Component } from '@angular/core';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-landing-header',
  templateUrl: './landing-header.component.html',
  styleUrl: './landing-header.component.scss'
})
export class LandingHeaderComponent {
  public userId: string | undefined =  undefined;

  constructor(private router: Router, private authService: AuthenticationService) {
    this.subscribeToLoggedUser();
  }
  
  public goToProfile(): void {
    if(!this.userId){
      alert("Vous devez vous connecter pour accéder à votre profil");
      return;
    }
    this.router.navigate([`/profile/${this.userId}`]);
  }

  // si l'utilisateur s'est enregistré, alors on va prendre son objet user
  private subscribeToLoggedUser(): void {
    this.authService.loggedUser.subscribe((user) => {
      if (user) {
        this.userId = user.id;
        return;
      }
      this.userId = undefined;
    });
  }


}
