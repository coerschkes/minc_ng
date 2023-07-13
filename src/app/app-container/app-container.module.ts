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
import { PlannerComponent } from './planner/planner.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { SettingsComponent } from './settings/settings.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatChipsModule} from '@angular/material/chips';
import {MatGridListModule} from '@angular/material/grid-list';

@NgModule({
  declarations: [
    AppContainerComponent,
    DashboardComponent,
    SidenavComponent,
    PlannerComponent,
    SettingsComponent,
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
    MatMenuModule,
    MatTooltipModule,
    MatExpansionModule,
    MatCardModule,
    MatFormFieldModule,
    MatChipsModule,
    MatGridListModule
  ],
})
export class AppContainerModule {}
