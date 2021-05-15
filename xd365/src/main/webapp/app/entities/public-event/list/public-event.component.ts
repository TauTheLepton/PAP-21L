import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPublicEvent } from '../public-event.model';
import { PublicEventService } from '../service/public-event.service';
import { PublicEventDeleteDialogComponent } from '../delete/public-event-delete-dialog.component';

import { Subscription } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-public-event',
  templateUrl: './public-event.component.html',
})
export class PublicEventComponent implements OnInit, OnDestroy {
  // static staticPublicEvents?: IPublicEvent[];

  account: Account | null = null;
  publicEvents?: IPublicEvent[];
  authSubscription?: Subscription;
  isLoading = false;

  constructor(protected publicEventService: PublicEventService, protected modalService: NgbModal, private accountService: AccountService) {}

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
    // PublicEventComponent.staticPublicEvents = this.publicEvents;
  }

  ngOnInit(): void {
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
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

  isAuthor(author: string, username: string): boolean {
    if (author === username) {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
