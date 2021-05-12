import * as dayjs from 'dayjs';
import { TimeUnits } from 'app/entities/enumerations/time-units.model';
import { Category } from 'app/entities/enumerations/category.model';

export interface IEvent {
  id?: number;
  eventName?: string;
  eventDate?: dayjs.Dayjs;
  howManyInstances?: number;
  cycleLength?: number | null;
  cycleUnit?: TimeUnits | null;
  category?: Category | null;
  userlogin?: string | null;
}

export class Event implements IEvent {
  constructor(
    public id?: number,
    public eventName?: string,
    public eventDate?: dayjs.Dayjs,
    public howManyInstances?: number,
    public cycleLength?: number | null,
    public cycleUnit?: TimeUnits | null,
    public category?: Category | null,
    public userlogin?: string | null
  ) {}
}

export function getEventIdentifier(event: IEvent): number | undefined {
  return event.id;
}
