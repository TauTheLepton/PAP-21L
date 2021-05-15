import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPublicEvent, getPublicEventIdentifier } from '../public-event.model';

export type EntityResponseType = HttpResponse<IPublicEvent>;
export type EntityArrayResponseType = HttpResponse<IPublicEvent[]>;

@Injectable({ providedIn: 'root' })
export class PublicEventService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/public-events');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(publicEvent: IPublicEvent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(publicEvent);
    return this.http
      .post<IPublicEvent>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(publicEvent: IPublicEvent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(publicEvent);
    return this.http
      .put<IPublicEvent>(`${this.resourceUrl}/${getPublicEventIdentifier(publicEvent) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(publicEvent: IPublicEvent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(publicEvent);
    return this.http
      .patch<IPublicEvent>(`${this.resourceUrl}/${getPublicEventIdentifier(publicEvent) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPublicEvent>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPublicEvent[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPublicEventToCollectionIfMissing(
    publicEventCollection: IPublicEvent[],
    ...publicEventsToCheck: (IPublicEvent | null | undefined)[]
  ): IPublicEvent[] {
    const publicEvents: IPublicEvent[] = publicEventsToCheck.filter(isPresent);
    if (publicEvents.length > 0) {
      const publicEventCollectionIdentifiers = publicEventCollection.map(publicEventItem => getPublicEventIdentifier(publicEventItem)!);
      const publicEventsToAdd = publicEvents.filter(publicEventItem => {
        const publicEventIdentifier = getPublicEventIdentifier(publicEventItem);
        if (publicEventIdentifier == null || publicEventCollectionIdentifiers.includes(publicEventIdentifier)) {
          return false;
        }
        publicEventCollectionIdentifiers.push(publicEventIdentifier);
        return true;
      });
      return [...publicEventsToAdd, ...publicEventCollection];
    }
    return publicEventCollection;
  }

  protected convertDateFromClient(publicEvent: IPublicEvent): IPublicEvent {
    return Object.assign({}, publicEvent, {
      eventDate: publicEvent.eventDate?.isValid() ? publicEvent.eventDate.toJSON() : undefined,
      eventEndDate: publicEvent.eventEndDate?.isValid() ? publicEvent.eventEndDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.eventDate = res.body.eventDate ? dayjs(res.body.eventDate) : undefined;
      res.body.eventEndDate = res.body.eventEndDate ? dayjs(res.body.eventEndDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((publicEvent: IPublicEvent) => {
        publicEvent.eventDate = publicEvent.eventDate ? dayjs(publicEvent.eventDate) : undefined;
        publicEvent.eventEndDate = publicEvent.eventEndDate ? dayjs(publicEvent.eventEndDate) : undefined;
      });
    }
    return res;
  }
}
