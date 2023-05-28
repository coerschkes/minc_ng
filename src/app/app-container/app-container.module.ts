import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppContainerRoutingModule } from './app-container-routing.module';
import { AppContainerComponent } from './app-container.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [AppContainerComponent, DashboardComponent],
  imports: [CommonModule, ReactiveFormsModule, AppContainerRoutingModule],
})
export class AppContainerModule {}
