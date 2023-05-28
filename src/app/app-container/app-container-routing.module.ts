import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../auth/login.guard';
import { UserResolver } from '../shared/application/user-resolver.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppContainerComponent } from './app-container.component';

const routes: Routes = [
  {
    path: '',
    component: AppContainerComponent,
    resolve: [UserResolver],
    canActivate: [LoginGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class AppContainerRoutingModule {}
