import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'nombre',
    loadComponent: () => import('./pages/nombre/nombre.page').then( m => m.NombrePage)
  },
];
