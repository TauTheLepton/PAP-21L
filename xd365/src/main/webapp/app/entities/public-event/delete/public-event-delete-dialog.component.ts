import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPublicEvent } from '../public-event.model';
import { PublicEventService } from '../service/public-event.service';

@Component({
  templateUrl: './public-event-delete-dialog.component.html',
})
export class PublicEventDeleteDialogComponent {
  publicEvent?: IPublicEvent;

  constructor(protected publicEventService: PublicEventService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.publicEventService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
