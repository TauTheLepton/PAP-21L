import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPublicEvent } from '../public-event.model';
import { PublicEventService } from '../service/public-event.service';
import { PublicEventDeleteDialogComponent } from '../delete/public-event-delete-dialog.component';

import { FormBuilder } from '@angular/forms';

import { Subscription } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-public-event',
  templateUrl: './public-event.component.html',
})
export class PublicEventComponent implements OnInit, OnDestroy {
  searchName!: string;

  account: Account | null = null;
  publicEvents?: IPublicEvent[];
  authSubscription?: Subscription;
  isLoading = false;

  editForm = this.fb.group({
    searchName: [],
  });

  constructor(
    protected publicEventService: PublicEventService,
    protected modalService: NgbModal,
    private accountService: AccountService,
    protected fb: FormBuilder
  ) {}

  loadAll(): void {
    this.updateSearchFilter();
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

  // funkcja sprawdzająca czy event podpada pod kryteria wyszukiwania
  searchFilter(name: string): boolean {
    if (this.searchName === '') {
      return true;
    } else {
      if (name.toLowerCase().includes(this.searchName.toLowerCase())) {
        return true;
      } else {
        return false;
      }
    }
  }

  // funkcja aktualizująca zmienną przechowującą wyszukiwaną fraze
  updateSearchFilter(): void {
    if (this.editForm.get(['searchName'])!.value == null) {
      this.searchName = '';
    } else {
      this.searchName = this.editForm.get(['searchName'])!.value;
    }
  }

  // funkcja sprawdzająca czy kryteria wyszukiwania są spełnione przez przynajmniej 1 event
  noSearchResults(): boolean {
    let listEmpty = true;
    for (const event of this.publicEvents!) {
      if (event.eventName!.toLowerCase().includes(this.searchName.toLowerCase())) {
        listEmpty = false;
      }
    }
    if (listEmpty) {
      return true;
    }
    return false;
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

  // funkcja sprawdzajaca czy użytkownik jest autorem eventu
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
