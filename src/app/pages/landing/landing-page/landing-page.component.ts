import { Component, OnDestroy, OnInit } from '@angular/core';
import { Image } from '../../../intefaces/image.interface';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private userId: string | undefined = undefined;

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.subscribeToLoggedUser();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  images: Image[] = [
    {
      src: 'assets/images/appart1.png',
      alt: 'appart1',
    },
    {
      src: 'assets/images/appart2.png',
      alt: 'appart2',
    },
    {
      src: 'assets/images/appart3.png',
      alt: 'appart3',
    },
    {
      src: 'assets/images/appart4.png',
      alt: 'appart4',
    },
  ];

  public onGetStartedClick(): void {
    if (this.userId) {
      this.router.navigate([`/map/authenticated`]);
    } else {
      this.router.navigate([`/map`]);
    }
  }

  private subscribeToLoggedUser(): void {
    this.authService.loggedUser$.subscribe((user) => {
      if (user) {
        this.userId = user.id;
      } else {
        this.userId = undefined;
      }
    });
  }
}
