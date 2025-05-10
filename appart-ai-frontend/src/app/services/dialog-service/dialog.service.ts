import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  UniversalDialogComponent,
  UniversalDialogData,
} from '../../shared/components/universal-dialog/universal-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  showInfo(message: string, title = 'Information', primaryAction = 'OK'): Observable<boolean> {
    return this.openDialog({
      title,
      message,
      type: 'info',
      primaryAction,
    });
  }

  showSuccess(
    message: string,
    title = 'Success',
    primaryAction = 'OK',
    autoClose = false
  ): Observable<boolean> {
    const dialogRef = this.dialog.open(UniversalDialogComponent, {
      data: {
        title,
        message,
        type: 'success',
        primaryAction,
      },
      width: '400px',
    });

    if (autoClose) {
      setTimeout(() => dialogRef.close(true), 3000);
    }

    return dialogRef.afterClosed();
  }

  showWarning(
    message: string,
    title = 'Warning',
    primaryAction = 'OK',
    secondaryAction?: string
  ): Observable<boolean> {
    return this.openDialog({
      title,
      message,
      type: 'warning',
      primaryAction,
      secondaryAction,
    });
  }

  showError(message: string, title = 'Error', primaryAction = 'OK'): Observable<boolean> {
    return this.openDialog({
      title,
      message,
      type: 'error',
      primaryAction,
    });
  }

  showConfirmation(
    message: string,
    title = 'Confirmation',
    primaryAction = 'Confirm',
    secondaryAction = 'Cancel'
  ): Observable<boolean> {
    return this.openDialog({
      title,
      message,
      type: 'info',
      primaryAction,
      secondaryAction,
    });
  }

  private openDialog(data: UniversalDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(UniversalDialogComponent, {
      data,
      width: '400px',
    });

    return dialogRef.afterClosed();
  }
}
