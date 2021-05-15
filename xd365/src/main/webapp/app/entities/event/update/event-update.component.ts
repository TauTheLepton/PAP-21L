import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IEvent, Event } from '../event.model';
import { EventService } from '../service/event.service';

@Component({
  selector: 'jhi-event-update',
  templateUrl: './event-update.component.html',
})
export class EventUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    eventName: [null, [Validators.required]],
    eventDate: [null, [Validators.required]],
    eventEndDate: [null, [Validators.required]],
    howManyInstances: [null, [Validators.required, Validators.min(1)]],
    cycleLength: [null, [Validators.min(1)]],
    cycleUnit: [],
    category: [],
    userlogin: [],
  });

  constructor(protected eventService: EventService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ event }) => {
      if (event.id === undefined) {
        const today = dayjs().startOf('day');
        event.eventDate = today;
        event.eventEndDate = today;
      }

      this.updateForm(event);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const event = this.createFromForm();
    if (event.id !== undefined) {
      this.subscribeToSaveResponse(this.eventService.update(event));
    } else {
      this.subscribeToSaveResponse(this.eventService.create(event));
    }
  }

  showCycleParams(): boolean {
    if (this.editForm.get(['howManyInstances'])!.value > 1) {
      return true;
    } else {
      return false;
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEvent>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(event: IEvent): void {
    this.editForm.patchValue({
      id: event.id,
      eventName: event.eventName,
      eventDate: event.eventDate ? event.eventDate.format(DATE_TIME_FORMAT) : null,
      eventEndDate: event.eventEndDate ? event.eventEndDate.format(DATE_TIME_FORMAT) : null,
      howManyInstances: event.howManyInstances,
      cycleLength: event.cycleLength,
      cycleUnit: event.cycleUnit,
      category: event.category,
      userlogin: event.userlogin,
    });
  }

  protected createFromForm(): IEvent {
    return {
      ...new Event(),
      id: this.editForm.get(['id'])!.value,
      eventName: this.editForm.get(['eventName'])!.value,
      eventDate: this.editForm.get(['eventDate'])!.value ? dayjs(this.editForm.get(['eventDate'])!.value, DATE_TIME_FORMAT) : undefined,
      eventEndDate: this.editForm.get(['eventEndDate'])!.value
        ? dayjs(this.editForm.get(['eventEndDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      howManyInstances: this.editForm.get(['howManyInstances'])!.value,
      cycleLength: this.editForm.get(['cycleLength'])!.value,
      cycleUnit: this.editForm.get(['cycleUnit'])!.value,
      category: this.editForm.get(['category'])!.value,
      userlogin: this.editForm.get(['userlogin'])!.value,
    };
  }
}
