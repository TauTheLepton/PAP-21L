import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { TimeUnits } from 'app/entities/enumerations/time-units.model';
import { Category } from 'app/entities/enumerations/category.model';
import { IPublicEvent, PublicEvent } from '../public-event.model';

import { PublicEventService } from './public-event.service';

describe('Service Tests', () => {
  describe('PublicEvent Service', () => {
    let service: PublicEventService;
    let httpMock: HttpTestingController;
    let elemDefault: IPublicEvent;
    let expectedResult: IPublicEvent | IPublicEvent[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PublicEventService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        eventName: 'AAAAAAA',
        eventDate: currentDate,
        eventEndDate: currentDate,
        howManyInstances: 0,
        cycleLength: 0,
        cycleUnit: TimeUnits.DAYS,
        category: Category.RECREATION,
        userlogin: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            eventDate: currentDate.format(DATE_TIME_FORMAT),
            eventEndDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a PublicEvent', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            eventDate: currentDate.format(DATE_TIME_FORMAT),
            eventEndDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            eventDate: currentDate,
            eventEndDate: currentDate,
          },
          returnedFromService
        );

        service.create(new PublicEvent()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a PublicEvent', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            eventName: 'BBBBBB',
            eventDate: currentDate.format(DATE_TIME_FORMAT),
            eventEndDate: currentDate.format(DATE_TIME_FORMAT),
            howManyInstances: 1,
            cycleLength: 1,
            cycleUnit: 'BBBBBB',
            category: 'BBBBBB',
            userlogin: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            eventDate: currentDate,
            eventEndDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a PublicEvent', () => {
        const patchObject = Object.assign(
          {
            eventName: 'BBBBBB',
            howManyInstances: 1,
            cycleUnit: 'BBBBBB',
            category: 'BBBBBB',
          },
          new PublicEvent()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            eventDate: currentDate,
            eventEndDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of PublicEvent', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            eventName: 'BBBBBB',
            eventDate: currentDate.format(DATE_TIME_FORMAT),
            eventEndDate: currentDate.format(DATE_TIME_FORMAT),
            howManyInstances: 1,
            cycleLength: 1,
            cycleUnit: 'BBBBBB',
            category: 'BBBBBB',
            userlogin: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            eventDate: currentDate,
            eventEndDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a PublicEvent', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPublicEventToCollectionIfMissing', () => {
        it('should add a PublicEvent to an empty array', () => {
          const publicEvent: IPublicEvent = { id: 123 };
          expectedResult = service.addPublicEventToCollectionIfMissing([], publicEvent);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(publicEvent);
        });

        it('should not add a PublicEvent to an array that contains it', () => {
          const publicEvent: IPublicEvent = { id: 123 };
          const publicEventCollection: IPublicEvent[] = [
            {
              ...publicEvent,
            },
            { id: 456 },
          ];
          expectedResult = service.addPublicEventToCollectionIfMissing(publicEventCollection, publicEvent);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a PublicEvent to an array that doesn't contain it", () => {
          const publicEvent: IPublicEvent = { id: 123 };
          const publicEventCollection: IPublicEvent[] = [{ id: 456 }];
          expectedResult = service.addPublicEventToCollectionIfMissing(publicEventCollection, publicEvent);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(publicEvent);
        });

        it('should add only unique PublicEvent to an array', () => {
          const publicEventArray: IPublicEvent[] = [{ id: 123 }, { id: 456 }, { id: 33991 }];
          const publicEventCollection: IPublicEvent[] = [{ id: 123 }];
          expectedResult = service.addPublicEventToCollectionIfMissing(publicEventCollection, ...publicEventArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const publicEvent: IPublicEvent = { id: 123 };
          const publicEvent2: IPublicEvent = { id: 456 };
          expectedResult = service.addPublicEventToCollectionIfMissing([], publicEvent, publicEvent2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(publicEvent);
          expect(expectedResult).toContain(publicEvent2);
        });

        it('should accept null and undefined values', () => {
          const publicEvent: IPublicEvent = { id: 123 };
          expectedResult = service.addPublicEventToCollectionIfMissing([], null, publicEvent, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(publicEvent);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
