import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPublicEvent } from '../public-event.model';
import { PublicEventService } from '../service/public-event.service';
import { PublicEventDeleteDialogComponent } from '../delete/public-event-delete-dialog.component';

@Component({
  selector: 'jhi-public-event',
  templateUrl: './public-event.component.html',
})
export class PublicEventComponent implements OnInit {
  publicEvents?: IPublicEvent[];
  isLoading = false;

  constructor(protected publicEventService: PublicEventService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.publicEventService.query().subscribe(
      (res: HttpResponse<IPublicEvent[]>) => {
        this.isLoading = false;
        this.publicEvents = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPublicEvent): number {
    return item.id!;
  }

  delete(publicEvent: IPublicEvent): void {
    const modalRef = this.modalService.open(PublicEventDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.publicEvent = publicEvent;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
