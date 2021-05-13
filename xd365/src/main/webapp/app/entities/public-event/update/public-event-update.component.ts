import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPublicEvent, PublicEvent } from '../public-event.model';
import { PublicEventService } from '../service/public-event.service';

@Component({
  selector: 'jhi-public-event-update',
  templateUrl: './public-event-update.component.html',
})
export class PublicEventUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    eventName: [null, [Validators.required]],
    eventDate: [null, [Validators.required]],
    howManyInstances: [null, [Validators.required, Validators.min(1)]],
    cycleLength: [null, [Validators.min(1)]],
    cycleUnit: [],
    category: [],
    userlogin: [],
  });

  constructor(protected publicEventService: PublicEventService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ publicEvent }) => {
      this.updateForm(publicEvent);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const publicEvent = this.createFromForm();
    if (publicEvent.id !== undefined) {
      this.subscribeToSaveResponse(this.publicEventService.update(publicEvent));
    } else {
      this.subscribeToSaveResponse(this.publicEventService.create(publicEvent));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPublicEvent>>): void {
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

  protected updateForm(publicEvent: IPublicEvent): void {
    this.editForm.patchValue({
      id: publicEvent.id,
      eventName: publicEvent.eventName,
      eventDate: publicEvent.eventDate,
      howManyInstances: publicEvent.howManyInstances,
      cycleLength: publicEvent.cycleLength,
      cycleUnit: publicEvent.cycleUnit,
      category: publicEvent.category,
      userlogin: publicEvent.userlogin,
    });
  }

  protected createFromForm(): IPublicEvent {
    return {
      ...new PublicEvent(),
      id: this.editForm.get(['id'])!.value,
      eventName: this.editForm.get(['eventName'])!.value,
      eventDate: this.editForm.get(['eventDate'])!.value,
      howManyInstances: this.editForm.get(['howManyInstances'])!.value,
      cycleLength: this.editForm.get(['cycleLength'])!.value,
      cycleUnit: this.editForm.get(['cycleUnit'])!.value,
      category: this.editForm.get(['category'])!.value,
      userlogin: this.editForm.get(['userlogin'])!.value,
    };
  }
}
