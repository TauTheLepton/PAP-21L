import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';

// import { EventComponent } from '../entities/event/list/event.component';
// import { PublicEventComponent } from '../entities/public-event/list/public-event.component';
// import { EventModule } from 'app/entities/event/event.module';
// import { PublicEventModule } from 'app/entities/public-event/public-event.module';
import { HttpResponse } from '@angular/common/http';
import { IEvent } from '../entities/event/event.model';
import { EventService } from '../entities/event/service/event.service';

import { IPublicEvent } from '../entities/public-event/public-event.model';
import { PublicEventService } from '../entities/public-event/service/public-event.service';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { RecursiveTemplateAstVisitor } from '@angular/compiler';
import * as dayjs from 'dayjs';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'jhi-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  authSubscription?: Subscription;

  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  iEvents: IEvent[] = [];
  iPublicEvents: IPublicEvent[] = [];
  events: CalendarEvent[] = [];
  //   {
  //     start: subDays(startOfDay(new Date()), 1),
  //     end: addDays(new Date(), 1),
  //     title: 'A 3 day event',
  //     color: colors.red,
  //     actions: this.actions,
  //     allDay: true,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true,
  //     },
  //     draggable: true,
  //   },
  //   {
  //     start: startOfDay(new Date()),
  //     title: 'An event with no end date',
  //     color: colors.yellow,
  //     actions: this.actions,
  //   },
  //   {
  //     start: subDays(endOfMonth(new Date()), 3),
  //     end: addDays(endOfMonth(new Date()), 3),
  //     title: 'A long event that spans 2 months',
  //     color: colors.blue,
  //     allDay: true,
  //   },
  //   {
  //     start: addHours(startOfDay(new Date()), 2),
  //     end: addHours(new Date(), 2),
  //     title: 'A draggable and resizable event',
  //     color: colors.yellow,
  //     actions: this.actions,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true,
  //     },
  //     draggable: true,
  //   },
  // ];

  activeDayIsOpen!: boolean;

  constructor(
    private modal: NgbModal,
    private accountService: AccountService,
    private router: Router,
    protected eventService: EventService,
    protected publicEventService: PublicEventService
  ) {}

  // proba zrobienia tego na bazie innej klasy, ale chyba nie pyklo
  // importEvents(): void {
  //   const staticEvents = EventComponent.staticEvents;
  //   const staticPublicEvents = PublicEventComponent.staticPublicEvents;
  //   let tempEvents;
  //   // let events = this.eventComponent.events;
  //   // const publicEvents = this.publicEventComponent.publicEvents;
  //   let setColor;
  //   for (let i = 0; i < 2; i++) {
  //     if (i === 0) {
  //       tempEvents = staticEvents;
  //       setColor = colors.blue;
  //     } else {
  //       tempEvents = staticPublicEvents;
  //       setColor = colors.yellow;
  //     }
  //     if (tempEvents !== undefined) {
  //       const length = tempEvents.length;
  //       if (length > 0) {
  //         for (let j = 0; j < length; j++) {
  //           const event = tempEvents[j];
  //           if (event.eventDate !== undefined && event.eventEndDate !== undefined) {
  //             // const startDate = event.eventDate?.format('MMMM DD, YYYY HH:mm:ss');
  //             const startDateYear = Number(event.eventDate.format('YYYY'));
  //             const startDateMonth = Number(event.eventDate.format('M'));
  //             const startDateDay = Number(event.eventDate.format('D'));
  //             const startDateHour = Number(event.eventDate.format('H'));
  //             const startDateMinute = Number(event.eventDate.format('m'));
  //             // const endDate = event.eventEndDate?.format('MMMM DD, YYYY HH:mm:ss');
  //             const endDateYear = Number(event.eventEndDate.format('YYYY'));
  //             const endDateMonth = Number(event.eventEndDate.format('M'));
  //             const endDateDay = Number(event.eventEndDate.format('D'));
  //             const endDateHour = Number(event.eventEndDate.format('H'));
  //             const endDateMinute = Number(event.eventEndDate.format('m'));
  //             this.events.push({
  //               id: event.id,
  //               // start: new Date(startDate!),
  //               start: new Date(startDateYear, startDateMonth, startDateDay, startDateHour, startDateMinute, 0, 0),
  //               // end: new Date(endDate!),
  //               end: new Date(endDateYear, endDateMonth, endDateDay, endDateHour, endDateMinute, 0, 0),
  //               title: event.eventName!,
  //               color: setColor,
  //             });
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  // proba z wlasnym czytaniem z bazy danych
  importEvents(): void {
    this.events = [];

    // magia sciagnieta z `event.component.ts`

    // this.isLoading = true;

    this.eventService.query().subscribe(
      (res: HttpResponse<IEvent[]>) => {
        // this.isLoading = false;
        this.iEvents = res.body ?? [];
      },
      () => {
        // this.isLoading = false;
      }
    );

    // test (to sie nie dodaje)
    this.iEvents = [
      {
        id: 2138,
        eventName: 'test1',
        eventDate: dayjs(2021 - 5 - 16).hour(12),
        eventEndDate: dayjs(2021 - 5 - 16).hour(16),
        howManyInstances: 1,
        userlogin: 'admin',
      },
    ];
    // (a to sie dodaje)
    this.events.push({
      id: 2137,
      start: new Date(),
      end: addDays(new Date(), 1),
      title: '2 day event test',
      color: colors.red,
    });

    // dodaje do eventow IEventy z bd
    let setColor = colors.blue;
    let length = this.iEvents.length;
    for (let i = 0; i < length; i++) {
      const event = this.iEvents[i];
      this.loadEvents(event, setColor);
    }

    // magia sciagnieta z `public-event.component.ts`

    // this.isLoading = true;

    this.publicEventService.query().subscribe(
      (res: HttpResponse<IPublicEvent[]>) => {
        // this.isLoading = false;
        this.iPublicEvents = res.body ?? [];
      },
      () => {
        // this.isLoading = false;
      }
    );

    // dodaje do eventow IPublicEventy z bd
    setColor = colors.yellow;
    length = this.iPublicEvents.length;
    for (let i = 0; i < length; i++) {
      const event = this.iPublicEvents[i];
      this.loadEvents(event, setColor);
    }
  }

  // dodaje do pola events wszystkie powtórzenia jednego wydarzenia
  loadEvents(event: IEvent | IPublicEvent, setColor: any): void {
    let repeats = 1;
    if (event.howManyInstances !== undefined) {
      repeats = event.howManyInstances;
    }
    const resp = this.getIEventsDates(event);
    let startEvent = resp[0];
    let endEvent = resp[1];
    for (let i = 0; i < repeats; i++) {
      this.events.push({
        id: event.id,
        start: startEvent,
        end: endEvent,
        title: event.eventName!,
        color: setColor,
      });
      if (event.cycleUnit === 'DAYS') {
        startEvent = addDays(startEvent, event.cycleLength!);
        endEvent = addDays(endEvent, event.cycleLength!);
      } else if (event.cycleUnit === 'WEEKS') {
        startEvent = addWeeks(startEvent, event.cycleLength!);
        endEvent = addWeeks(endEvent, event.cycleLength!);
      } else if (event.cycleUnit === 'MONTHS') {
        startEvent = addMonths(startEvent, event.cycleLength!);
        endEvent = addMonths(endEvent, event.cycleLength!);
      } else if (event.cycleUnit === 'YEARS') {
        startEvent = addYears(startEvent, event.cycleLength!);
        endEvent = addYears(endEvent, event.cycleLength!);
      }
    }
  }

  // zamienia typ IEvent i IPublicEvent na dwie daty, poczatkowa i koncowa
  getIEventsDates(event: IEvent | IPublicEvent): Date[] {
    let response = [new Date(), new Date()];
    if (event.eventDate !== undefined && event.eventEndDate !== undefined) {
      const startDateYear = Number(event.eventDate.format('YYYY'));
      const startDateMonth = Number(event.eventDate.format('M'));
      const startDateDay = Number(event.eventDate.format('D'));
      const startDateHour = Number(event.eventDate.format('H'));
      const startDateMinute = Number(event.eventDate.format('m'));
      const endDateYear = Number(event.eventEndDate.format('YYYY'));
      const endDateMonth = Number(event.eventEndDate.format('M'));
      const endDateDay = Number(event.eventEndDate.format('D'));
      const endDateHour = Number(event.eventEndDate.format('H'));
      const endDateMinute = Number(event.eventEndDate.format('m'));
      const resp1 = new Date(startDateYear, startDateMonth, startDateDay, startDateHour, startDateMinute, 0, 0);
      const resp2 = new Date(endDateYear, endDateMonth, endDateDay, endDateHour, endDateMinute, 0, 0);
      response = [resp1, resp2];
    }
    return response;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    // alert('clicked the ' + event.id.toString() +'!');
    // this.router.navigate(['/public-event/' + event.id.toString() + '/view']);
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        id: '1001',
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent): void {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView): void {
    this.view = view;
  }

  closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = false;
  }

  ngOnInit(): void {
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
    // odkomentowac to potem zeby sie ladowalo chyba
    this.importEvents();
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
