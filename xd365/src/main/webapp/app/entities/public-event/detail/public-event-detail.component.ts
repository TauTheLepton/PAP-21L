import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPublicEvent } from '../public-event.model';

@Component({
  selector: 'jhi-public-event-detail',
  templateUrl: './public-event-detail.component.html',
})
export class PublicEventDetailComponent implements OnInit {
  publicEvent: IPublicEvent | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ publicEvent }) => {
      this.publicEvent = publicEvent;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
