import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPublicEvent, PublicEvent } from '../public-event.model';
import { PublicEventService } from '../service/public-event.service';

@Injectable({ providedIn: 'root' })
export class PublicEventRoutingResolveService implements Resolve<IPublicEvent> {
  constructor(protected service: PublicEventService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPublicEvent> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((publicEvent: HttpResponse<PublicEvent>) => {
          if (publicEvent.body) {
            return of(publicEvent.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PublicEvent());
  }
}
