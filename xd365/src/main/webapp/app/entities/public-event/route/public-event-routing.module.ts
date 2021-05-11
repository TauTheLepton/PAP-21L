import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PublicEventComponent } from '../list/public-event.component';
import { PublicEventDetailComponent } from '../detail/public-event-detail.component';
import { PublicEventUpdateComponent } from '../update/public-event-update.component';
import { PublicEventRoutingResolveService } from './public-event-routing-resolve.service';

const publicEventRoute: Routes = [
  {
    path: '',
    component: PublicEventComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PublicEventDetailComponent,
    resolve: {
      publicEvent: PublicEventRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PublicEventUpdateComponent,
    resolve: {
      publicEvent: PublicEventRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PublicEventUpdateComponent,
    resolve: {
      publicEvent: PublicEventRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(publicEventRoute)],
  exports: [RouterModule],
})
export class PublicEventRoutingModule {}
