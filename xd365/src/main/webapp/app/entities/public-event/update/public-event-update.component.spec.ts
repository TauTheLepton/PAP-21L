jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PublicEventService } from '../service/public-event.service';
import { IPublicEvent, PublicEvent } from '../public-event.model';

import { PublicEventUpdateComponent } from './public-event-update.component';

describe('Component Tests', () => {
  describe('PublicEvent Management Update Component', () => {
    let comp: PublicEventUpdateComponent;
    let fixture: ComponentFixture<PublicEventUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let publicEventService: PublicEventService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PublicEventUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PublicEventUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PublicEventUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      publicEventService = TestBed.inject(PublicEventService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const publicEvent: IPublicEvent = { id: 456 };

        activatedRoute.data = of({ publicEvent });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(publicEvent));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const publicEvent = { id: 123 };
        spyOn(publicEventService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ publicEvent });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: publicEvent }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(publicEventService.update).toHaveBeenCalledWith(publicEvent);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const publicEvent = new PublicEvent();
        spyOn(publicEventService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ publicEvent });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: publicEvent }));
        saveSubject.complete();

        // THEN
        expect(publicEventService.create).toHaveBeenCalledWith(publicEvent);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const publicEvent = { id: 123 };
        spyOn(publicEventService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ publicEvent });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(publicEventService.update).toHaveBeenCalledWith(publicEvent);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
