import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './animations/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [AlertComponent, LoadingSpinnerComponent],
  imports: [CommonModule],
  exports: [CommonModule, AlertComponent, LoadingSpinnerComponent],
})
export class SharedModule {}
