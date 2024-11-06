import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LandlordInfo } from '../../../../intefaces/user.interface';

@Component({
  selector: 'app-contact-land-lord',
  templateUrl: './contact-land-lord.component.html',
  styleUrl: './contact-land-lord.component.scss'
})
export class ContactLandLordComponent {
  constructor(
    public dialogRef: MatDialogRef<ContactLandLordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LandlordInfo
  ) {}

  contactByPhone(): void {
    window.location.href = `tel:${this.data.landlordPhone}`;
    this.dialogRef.close();
  }

  contactByEmail(): void {
    window.location.href = `mailto:${this.data.landlordEmail}`;
    this.dialogRef.close();
  }
}
