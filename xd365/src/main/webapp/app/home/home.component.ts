import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { addDays, addWeeks, addMonths, addYears, isSameDay, isSameMonth, isBefore, isAfter, startOfMonth, endOfMonth } from 'date-fns';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView, DAYS_OF_WEEK } from 'angular-calendar';

import { HttpResponse } from '@angular/common/http';
import { IEvent } from '../entities/event/event.model';
import { EventService } from '../entities/event/service/event.service';

import { IPublicEvent } from '../entities/public-event/public-event.model';
import { PublicEventService } from '../entities/public-event/service/public-event.service';
import { TimeUnits } from '../entities/enumerations/time-units.model';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

// kody kolorów eventów w kalendarzu
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

  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  // // chciałbym ten komentarz zadedykować użytkownikowi KACPER MARKOWSKI za swoje zasługi i zrobienie tego dobrze, z całego serca DZIĘKUJĘ!
  // spoko

  iEvents!: IEvent[];
  iPublicEvents!: IPublicEvent[];
  events: CalendarEvent[] = [];
  todayEvents: CalendarEvent[] = [];
  isLoading = false;
  showPublicEvents = true;
  hours = '';
  listHoursStatus = 0;

  activeDayIsOpen!: boolean;

  constructor(
    private modal: NgbModal,
    private accountService: AccountService,
    private router: Router,
    protected eventService: EventService,
    protected publicEventService: PublicEventService
  ) {}

  // metoda uzywana przez guzik do ukrywania/pokazywania public-eventów
  togglePublicEventsView(): void {
    if (this.showPublicEvents === true) {
      this.showPublicEvents = false;
    } else {
      this.showPublicEvents = true;
    }
  }

  // metoda służąca do ukrywania listy dzisiejszych eventów
  isTodayEventsEmpty(): boolean {
    if (this.todayEvents.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  // zwraca string godziny z podanej daty
  // używane w liście dzisiejszych eventów w metodzie todayEventsGetHours()
  getEventTimeToString(date: Date): string {
    let hours;
    let minutes;
    if (date.getHours() < 10) {
      hours = '0' + date.getHours().toString();
    } else {
      hours = date.getHours().toString();
    }
    if (date.getMinutes() < 10) {
      minutes = '0' + date.getMinutes().toString();
    } else {
      minutes = date.getMinutes().toString();
    }
    return hours + ':' + minutes;
  }

  // ustawia odpowiednie godziny i statusy dla danego eventa
  // używane dla listy dzisiejszych eventów w htmlu
  todayEventsGetHours(event: CalendarEvent): boolean {
    this.hours = '';
    this.listHoursStatus = 0;
    const today = new Date();
    if (isSameDay(event.start, today) && isSameDay(event.end!, today)) {
      this.hours = this.getEventTimeToString(event.start) + ' - ' + this.getEventTimeToString(event.end!);
      this.listHoursStatus = 1;
    } else if (isSameDay(event.start, today) && !isSameDay(event.end!, today)) {
      this.hours = this.getEventTimeToString(event.start);
      this.listHoursStatus = 2;
    } else if (!isSameDay(event.start, today) && isSameDay(event.end!, today)) {
      this.hours = this.getEventTimeToString(event.end!);
      this.listHoursStatus = 3;
    }
    return true;
  }

  // importuje eventy z bazy danych i ustawia wszystkie w liście `events`
  // wywołuje się w htmlu
  importEvents(): boolean {
    this.events = [];
    this.todayEvents = [];

    // pobieranie eventów z BD
    this.isLoading = true;
    this.eventService.query().subscribe(
      (res: HttpResponse<IEvent[]>) => {
        this.isLoading = false;
        this.iEvents = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );

    // dodaje do eventow IEventy z bd
    let setColor = colors.blue;
    let length = this.iEvents.length;
    for (let i = 0; i < length; i++) {
      const event = this.iEvents[i];
      const link = 'event/' + event.id!.toString();
      this.loadEvents(event, setColor, link);
    }

    if (this.showPublicEvents) {
      // pobieranie public-eventów z BD
      this.isLoading = true;
      this.publicEventService.query().subscribe(
        (res: HttpResponse<IPublicEvent[]>) => {
          this.isLoading = false;
          this.iPublicEvents = res.body ?? [];
        },
        () => {
          this.isLoading = false;
        }
      );

      // dodaje do eventow IPublicEventy z bd
      setColor = colors.yellow;
      length = this.iPublicEvents.length;
      for (let i = 0; i < length; i++) {
        const event = this.iPublicEvents[i];
        const link = 'public-event/' + event.id!.toString();
        this.loadEvents(event, setColor, link);
      }
    }
    return true;
  }

  // dodaje do pola events i todayEvents wszystkie powtórzenia jednego wydarzenia
  loadEvents(event: IEvent | IPublicEvent, setColor: any, link: string): void {
    let repeats = 1;
    if (event.howManyInstances != null) {
      repeats = event.howManyInstances;
    }
    const resp = this.getIEventsDates(event);
    const originalStartEvent = resp[0];
    let startEvent = resp[0];
    const originalEndEvent = resp[1];
    let endEvent = resp[1];
    for (let i = 0; i < repeats; i++) {
      let eventTitle = event.eventName;
      if (eventTitle == null) {
        eventTitle = 'Event with no title';
      }
      let length = event.cycleLength;
      // zabezpieczenie jak ktoś nie poda jednostki cyklu
      if (length == null) {
        length = 1;
      }
      length = length * i;
      let load = true;
      if (event.cycleUnit === TimeUnits.DAYS) {
        startEvent = addDays(originalStartEvent, length);
        endEvent = addDays(originalEndEvent, length);
      } else if (event.cycleUnit === TimeUnits.WEEKS) {
        startEvent = addWeeks(originalStartEvent, length);
        endEvent = addWeeks(originalEndEvent, length);
      } else if (event.cycleUnit === TimeUnits.MONTHS) {
        startEvent = addMonths(originalStartEvent, length);
        endEvent = addMonths(originalEndEvent, length);
        // upewnienie się, że to ten sam dzień
        if (originalStartEvent.getDate() === originalEndEvent.getDate()) {
          if (startEvent.getDate() !== originalStartEvent.getDate() || endEvent.getDate() !== originalEndEvent.getDate()) {
            load = false;
          }
        } else {
          if (startEvent.getDate() !== originalStartEvent.getDate()) {
            startEvent = startOfMonth(addMonths(startEvent, 1));
          }
          if (endEvent.getDate() !== originalEndEvent.getDate()) {
            endEvent = endOfMonth(endEvent);
          }
        }
      } else if (event.cycleUnit === TimeUnits.YEARS) {
        startEvent = addYears(originalStartEvent, length);
        endEvent = addYears(originalEndEvent, length);
        // upewnienie się, że to ten sam dzień i miesiąc
        if (originalStartEvent.getDate() === originalEndEvent.getDate() && originalStartEvent.getMonth() === originalEndEvent.getMonth()) {
          if (
            startEvent.getDate() !== originalStartEvent.getDate() ||
            endEvent.getDate() !== originalEndEvent.getDate() ||
            startEvent.getMonth() !== originalStartEvent.getMonth() ||
            endEvent.getMonth() !== originalEndEvent.getMonth()
          ) {
            load = false;
          }
        } else {
          if (startEvent.getDate() !== originalStartEvent.getDate() || startEvent.getMonth() !== originalStartEvent.getMonth()) {
            startEvent = startOfMonth(addMonths(startEvent, 1));
          }
          if (endEvent.getDate() !== originalEndEvent.getDate() || endEvent.getMonth() !== originalEndEvent.getMonth()) {
            endEvent = endOfMonth(endEvent);
          }
        }
      } else {
        // zabezpieczenie jak ktoś nie poda długości cyklu
        startEvent = addDays(originalStartEvent, length);
        endEvent = addDays(originalEndEvent, length);
      }
      if (load) {
        this.loadEvent(this.events, link, startEvent, endEvent, eventTitle, setColor);
        const today = new Date();
        if (isSameDay(startEvent, today) || isSameDay(endEvent, today) || (isBefore(startEvent, today) && isAfter(endEvent, today))) {
          this.loadEvent(this.todayEvents, link, startEvent, endEvent, eventTitle, setColor);
        }
      }
    }
  }

  // zapisuje event o podanych parametrach do podanej listy
  loadEvent(list: CalendarEvent[], link: string, startEvent: Date, endEvent: Date, eventTitle: string, setColor: any): void {
    list.push({
      id: link,
      start: startEvent,
      end: endEvent,
      title: eventTitle,
      color: setColor,
    });
  }

  // zamienia typ IEvent i IPublicEvent na dwie daty, poczatkowa i koncowa
  getIEventsDates(event: IEvent | IPublicEvent): Date[] {
    const response = [new Date(), new Date()];
    if (event.eventDate != null) {
      response[0] = event.eventDate.toDate();
    }
    if (event.eventEndDate != null) {
      response[1] = event.eventEndDate.toDate();
    }
    return response;
  }

  // funkcja odpowiadajaca za rozwijanie widoku dnia
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

  // funkcja przekierowująca do strony eventu
  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.router.navigate(['/' + event.id!.toString() + '/view']);
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
