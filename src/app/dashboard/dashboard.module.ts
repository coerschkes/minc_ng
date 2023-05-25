import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../auth/login.guard';
import { UserResolver } from '../shared/application/user-resolver.service';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: [UserResolver],
    canActivate: [LoginGuard],
  },
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)],
})
export class DashboardModule {}
