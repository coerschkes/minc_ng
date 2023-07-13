import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserResolver } from '../shared/application/user-resolver.service';
import { AppContainerComponent } from './app-container.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlannerComponent } from './planner/planner.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginGuard } from '../auth/guard/login.guard';

const routes: Routes = [
  {
    path: '',
    component: AppContainerComponent,
    resolve: [UserResolver],
    canActivate: [LoginGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'planner',
        component: PlannerComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppContainerRoutingModule {}
