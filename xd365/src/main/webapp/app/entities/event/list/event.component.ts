import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FormBuilder } from '@angular/forms';

import { IEvent } from '../event.model';
import { EventService } from '../service/event.service';
import { EventDeleteDialogComponent } from '../delete/event-delete-dialog.component';

@Component({
  selector: 'jhi-event',
  templateUrl: './event.component.html',
})
export class EventComponent implements OnInit {
  searchName!: string;

  events?: IEvent[];
  isLoading = false;

  editForm = this.fb.group({
    searchName: [],
  });

  constructor(protected eventService: EventService, protected modalService: NgbModal, protected fb: FormBuilder) {}

  loadAll(): void {
    this.updateSearchFilter();
    this.isLoading = true;
    this.eventService.query().subscribe(
      (res: HttpResponse<IEvent[]>) => {
        this.isLoading = false;
        this.events = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  // funkcja sprawdzająca czy dany event podlega kryteriom wyszukiwania
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

  // funkcja aktualizująca zmienną przechowującą wyszukaną fraze
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
    for (const event of this.events!) {
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
    this.loadAll();
  }

  trackId(index: number, item: IEvent): number {
    return item.id!;
  }

  delete(event: IEvent): void {
    const modalRef = this.modalService.open(EventDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.event = event;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
