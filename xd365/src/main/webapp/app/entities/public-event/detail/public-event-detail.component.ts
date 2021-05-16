import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPublicEvent } from '../public-event.model';

import { Subscription } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-public-event-detail',
  templateUrl: './public-event-detail.component.html',
})
export class PublicEventDetailComponent implements OnInit, OnDestroy {
  publicEvent: IPublicEvent | null = null;

  account: Account | null = null;
  authSubscription?: Subscription;

  constructor(protected activatedRoute: ActivatedRoute, private accountService: AccountService) {}

  ngOnInit(): void {
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
    this.activatedRoute.data.subscribe(({ publicEvent }) => {
      this.publicEvent = publicEvent;
    });
  }

  previousState(): void {
    window.history.back();
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
