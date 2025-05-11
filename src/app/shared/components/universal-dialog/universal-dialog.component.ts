import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface UniversalDialogData {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  primaryAction?: string;
  secondaryAction?: string;
}

@Component({
  selector: 'app-universal-dialog',
  templateUrl: './universal-dialog.component.html',
  styleUrl: './universal-dialog.component.scss',
})
export class UniversalDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UniversalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UniversalDialogData
  ) {
    this.data.primaryAction = this.data.primaryAction || 'OK';
    this.data.type = this.data.type || 'info';
  }

  onPrimaryAction(): void {
    this.dialogRef.close(true);
  }

  onSecondaryAction(): void {
    this.dialogRef.close(false);
  }
}
