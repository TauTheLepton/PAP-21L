import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PublicEventService } from '../service/public-event.service';

import { PublicEventComponent } from './public-event.component';

describe('Component Tests', () => {
  describe('PublicEvent Management Component', () => {
    let comp: PublicEventComponent;
    let fixture: ComponentFixture<PublicEventComponent>;
    let service: PublicEventService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PublicEventComponent],
      })
        .overrideTemplate(PublicEventComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PublicEventComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(PublicEventService);

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
      expect(comp.publicEvents?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
