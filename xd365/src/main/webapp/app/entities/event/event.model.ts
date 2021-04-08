import * as dayjs from 'dayjs';
import { YesNo } from 'app/entities/enumerations/yes-no.model';
import { TimeUnits } from 'app/entities/enumerations/time-units.model';
import { Category } from 'app/entities/enumerations/category.model';

export interface IEvent {
  id?: number;
  eventName?: string;
  eventDate?: dayjs.Dayjs;
  isCyclical?: YesNo;
  cycleLength?: number | null;
  cycleUnit?: TimeUnits | null;
  isPublic?: YesNo;
  category?: Category | null;
}

export class Event implements IEvent {
  constructor(
    public id?: number,
    public eventName?: string,
    public eventDate?: dayjs.Dayjs,
    public isCyclical?: YesNo,
    public cycleLength?: number | null,
    public cycleUnit?: TimeUnits | null,
    public isPublic?: YesNo,
    public category?: Category | null
  ) {}
}

export function getEventIdentifier(event: IEvent): number | undefined {
  return event.id;
}
