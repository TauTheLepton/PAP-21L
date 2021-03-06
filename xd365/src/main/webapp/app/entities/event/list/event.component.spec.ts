import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EventService } from '../service/event.service';

import { EventComponent } from './event.component';

describe('Component Tests', () => {
  describe('Event Management Component', () => {
    let comp: EventComponent;
    let fixture: ComponentFixture<EventComponent>;
    let service: EventService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EventComponent],
      })
        .overrideTemplate(EventComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EventComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(EventService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.events?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
