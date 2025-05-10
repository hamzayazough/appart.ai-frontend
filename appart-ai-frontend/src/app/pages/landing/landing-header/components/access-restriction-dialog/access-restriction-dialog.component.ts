import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../../services/auth/authentication.service';

interface DialogData {
  feature: string;
  message: string;
  isLoggedIn: boolean;
}

@Component({
  selector: 'app-access-restriction-dialog',
  templateUrl: './access-restriction-dialog.component.html',
  styleUrl: './access-restriction-dialog.component.scss',
})
export class AccessRestrictionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AccessRestrictionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  onLogin(): void {
    this.dialogRef.close();
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      if (!isAuthenticated) {
        this.router.navigate(['/login']);
      }
    });
  }

  onCompletePreferences(): void {
    this.dialogRef.close();
    const userId = this.authService.getUser()?.id;
    if (userId) {
      this.router.navigate([`/account/${userId}/preferences`]);
    }
  }
}
