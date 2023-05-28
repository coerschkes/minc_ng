import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppContainerRoutingModule } from './app-container-routing.module';
import { AppContainerComponent } from './app-container.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidenavComponent } from './sidenav/sidenav.component';

@NgModule({
  declarations: [
    AppContainerComponent,
    DashboardComponent,
    SidenavComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppContainerRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class AppContainerModule {}
