import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './animations/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    AlertComponent,
    AlertDialogComponent,
    LoadingSpinnerComponent,
    AlertDialogComponent,
  ],
  imports: [CommonModule],
  exports: [
    CommonModule,
    AlertDialogComponent,
    LoadingSpinnerComponent,
    AlertComponent,
  ],
})
export class SharedModule {}
