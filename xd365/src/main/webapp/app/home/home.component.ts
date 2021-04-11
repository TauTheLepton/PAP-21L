import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { OptionsInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarComponent } from 'ng-fullcalendar';
import { isInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  authSubscription?: Subscription;
  options: OptionsInput | undefined;

  @ViewChild('fullcalendar') fullcalendar: CalendarComponent | undefined;
  eventsModel: { title: string; start: string; end: string; }[] | any;

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
    this.options = {
      editable: true,
      events: [{
        title: 'Long Event',
        start: this.yearMonth + '-07',
        end: this.yearMonth + '-10'
      }],
      customButtons: {
        myCustomButton: {
          text: 'custom!',
          click() {
            alert('clicked the custom button!');
          }
        },
        mySecondButton: {
          text: 'test',
          click(){
            $('body,html').animate({
              scrollTop: $(document).height()
          }, 1000);
          // $('#date').DatePickerShow();
          }
        }
      },
      header: {
        left: 'prev,next today myCustomButton',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      plugins: [ dayGridPlugin, interactionPlugin ]
    };
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

  eventClick(model: any): void {
    // console.log(model);
    document.write(model);
  }

  eventDragStop(model: any): void {
    // console.log(model);
    document.write(model);
  }

  clickButton(model: any): void {
    // console.log(model);
    document.write(model);
  }

  dateClick(model: any): void {
    // console.log(model);
    document.write(model);
  }

  updateEvents(): void {
    this.eventsModel = [{
      title: 'Update Event',
      start: this.yearMonth + '-08',
      end: this.yearMonth + '-10'
    }];
  }

  get yearMonth(): string {
    const dateObj = new Date();
    return String(dateObj.getUTCFullYear()) + '-' + String(dateObj.getUTCMonth() + 1);
  }
}





function eventDragStop(model: any, any: any): void {
  throw new Error('Function not implemented.');
}
// @Component({
//   selector: 'my-app',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent implements OnInit {
//   options: OptionsInput;
//   eventsModel: any;
  
//   ngOnInit() {
    

//   }
  
// }
