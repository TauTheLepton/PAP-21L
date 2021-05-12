import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'event',
        data: { pageTitle: 'xd365App.event.home.title' },
        loadChildren: () => import('./event/event.module').then(m => m.EventModule),
      },
      {
        path: 'public-event',
        data: { pageTitle: 'xd365App.publicEvent.home.title' },
        loadChildren: () => import('./public-event/public-event.module').then(m => m.PublicEventModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
