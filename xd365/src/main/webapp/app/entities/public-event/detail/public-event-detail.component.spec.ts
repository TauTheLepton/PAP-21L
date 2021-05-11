import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PublicEventDetailComponent } from './public-event-detail.component';

describe('Component Tests', () => {
  describe('PublicEvent Management Detail Component', () => {
    let comp: PublicEventDetailComponent;
    let fixture: ComponentFixture<PublicEventDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PublicEventDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ publicEvent: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(PublicEventDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PublicEventDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load publicEvent on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.publicEvent).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
