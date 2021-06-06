import * as dayjs from 'dayjs';
import { TimeUnits } from 'app/entities/enumerations/time-units.model';
import { Category } from 'app/entities/enumerations/category.model';

export interface IPublicEvent {
  id?: number;
  eventName?: string;
  eventDate?: dayjs.Dayjs;
  eventEndDate?: dayjs.Dayjs;
  howManyInstances?: number;
  cycleLength?: number | null;
  cycleUnit?: TimeUnits | null;
  category?: Category | null;
  description?: string | null;
  userlogin?: string | null;
}

export class PublicEvent implements IPublicEvent {
  constructor(
    public id?: number,
    public eventName?: string,
    public eventDate?: dayjs.Dayjs,
    public eventEndDate?: dayjs.Dayjs,
    public howManyInstances?: number,
    public cycleLength?: number | null,
    public cycleUnit?: TimeUnits | null,
    public category?: Category | null,
    public description?: string | null,
    public userlogin?: string | null
  ) {}
}

export function getPublicEventIdentifier(publicEvent: IPublicEvent): number | undefined {
  return publicEvent.id;
}
