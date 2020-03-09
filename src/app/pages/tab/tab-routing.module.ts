import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabPage } from './tab.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tab/contacts',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TabPage,
    children: [
      {
        path: 'contacts',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../contacts/contacts.module').then(m => m.ContactsPageModule)
          }
        ]
      },
      {
        path: 'groups',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../groups/groups.module').then(m => m.GroupsPageModule)
          }
        ]
      },
      {
        path: 'bots',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../bots/bots.module').then(m => m.BotsPageModule)
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabPageRoutingModule {}
