import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { PublicEventComponent } from './list/public-event.component';
import { PublicEventDetailComponent } from './detail/public-event-detail.component';
import { PublicEventUpdateComponent } from './update/public-event-update.component';
import { PublicEventDeleteDialogComponent } from './delete/public-event-delete-dialog.component';
import { PublicEventRoutingModule } from './route/public-event-routing.module';

@NgModule({
  imports: [SharedModule, PublicEventRoutingModule],
  declarations: [PublicEventComponent, PublicEventDetailComponent, PublicEventUpdateComponent, PublicEventDeleteDialogComponent],
  entryComponents: [PublicEventDeleteDialogComponent],
})
export class PublicEventModule {}
