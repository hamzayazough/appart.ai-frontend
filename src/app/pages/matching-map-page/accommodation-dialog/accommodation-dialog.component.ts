import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import type { AccommodationMatchingDTO } from '../../../intefaces/accommodation.interface';

@Component({
  selector: 'app-accommodation-dialog',
  templateUrl: './accommodation-dialog.component.html',
  styleUrls: ['./accommodation-dialog.component.scss'],
})
export class AccommodationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AccommodationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { accommodation: AccommodationMatchingDTO }
  ) {}

  get formattedScore(): number {
    const score = this.data.accommodation.matching.score?.total || 0;
    return Math.round(score * 100);
  }

  close(): void {
    this.dialogRef.close();
  }
}
