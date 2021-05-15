import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';

import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { HomeComponent } from './home.component';
import { EventModule } from 'app/entities/event/event.module';
import { PublicEventModule } from 'app/entities/public-event/public-event.module';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    RouterModule.forChild([HOME_ROUTE]),
    EventModule,
    PublicEventModule,
  ],
  declarations: [HomeComponent],
})
export class HomeModule {}
