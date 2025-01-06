import { Component, Input, Inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { combineLatest, filter, Subject, takeUntil } from 'rxjs';
import { TokenService } from '../../../../../services/token-service/token.service';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrl: './auth-button.component.scss'
})
export class AuthButtonComponent implements OnInit, OnDestroy {
  @Input() message: string = 'Se connecter';
  private unsubscribe$ = new Subject<void>();

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    combineLatest([this.auth.isAuthenticated$, this.tokenService.getToken$()])
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(([isAuthenticated, token]) => isAuthenticated && !!token)
      )
      .subscribe();

    this.auth.user$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}