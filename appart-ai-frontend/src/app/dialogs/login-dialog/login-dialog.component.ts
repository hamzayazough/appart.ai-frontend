import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss'
})
export class LoginDialogComponent {

  constructor( 
    public dialogRef: MatDialogRef<LoginDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) { 
    } 
  
  onCancel(): void { 
    this.dialogRef.close(); 
  } 

}
