import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

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
    isCyclical: [null, [Validators.required]],
    cycleLength: [null, [Validators.min(1)]],
    cycleUnit: [],
    isPublic: [null, [Validators.required]],
    category: [],
  });

  constructor(protected eventService: EventService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ event }) => {
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
      eventDate: event.eventDate,
      isCyclical: event.isCyclical,
      cycleLength: event.cycleLength,
      cycleUnit: event.cycleUnit,
      isPublic: event.isPublic,
      category: event.category,
    });
  }

  protected createFromForm(): IEvent {
    return {
      ...new Event(),
      id: this.editForm.get(['id'])!.value,
      eventName: this.editForm.get(['eventName'])!.value,
      eventDate: this.editForm.get(['eventDate'])!.value,
      isCyclical: this.editForm.get(['isCyclical'])!.value,
      cycleLength: this.editForm.get(['cycleLength'])!.value,
      cycleUnit: this.editForm.get(['cycleUnit'])!.value,
      isPublic: this.editForm.get(['isPublic'])!.value,
      category: this.editForm.get(['category'])!.value,
    };
  }
}
