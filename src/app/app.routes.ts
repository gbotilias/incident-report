import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'incidents',
  },
  {
    path: 'incidents',
    loadComponent: () =>
      import('./features/incidents/incident-container/incident-container').then(
        (m) => m.IncidentContainerComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'incidents',
  },
];
