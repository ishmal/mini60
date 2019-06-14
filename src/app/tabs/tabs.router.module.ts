import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'run',
        children: [
          {
            path: '',
            loadChildren: '../run/run.module#RunModule'
          }
        ]
      },
      {
        path: 'select',
        children: [
          {
            path: '',
            loadChildren: '../select/select.module#SelectModule'
          }
        ]
      },
      {
        path: 'config',
        children: [
          {
            path: '',
            loadChildren: '../config/config.module#ConfigModule'
          }
        ]
      },
      {
        path: 'help',
        children: [
          {
            path: '',
            loadChildren: '../help/help.module#HelpModule'
          }
        ]
      },
      {
        path: 'about',
        children: [
          {
            path: '',
            loadChildren: '../about/about.module#AboutModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/run',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/run',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
