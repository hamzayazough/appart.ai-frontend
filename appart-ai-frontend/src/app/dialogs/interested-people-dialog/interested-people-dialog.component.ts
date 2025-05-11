import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppUser } from '../../intefaces/user.interface';

@Component({
  selector: 'app-interested-people-dialog',
  templateUrl: './interested-people-dialog.component.html',
  styleUrl: './interested-people-dialog.component.scss'
})
export class InterestedPeopleDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { interestedPeople: AppUser[] }, private dialogRef: MatDialogRef<InterestedPeopleDialogComponent>) {}
  
  closeDialog() {
    this.dialogRef.close();
  }

}
