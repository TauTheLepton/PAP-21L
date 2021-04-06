import { YesNo } from 'app/entities/enumerations/yes-no.model';
import { Category } from 'app/entities/enumerations/category.model';

export interface IEvent {
  id?: number;
  eventName?: string;
  eventDay?: number;
  isCyclical?: YesNo;
  cycleLength?: number | null;
  isPublic?: YesNo;
  category?: Category | null;
}

export class Event implements IEvent {
  constructor(
    public id?: number,
    public eventName?: string,
    public eventDay?: number,
    public isCyclical?: YesNo,
    public cycleLength?: number | null,
    public isPublic?: YesNo,
    public category?: Category | null
  ) {}
}

export function getEventIdentifier(event: IEvent): number | undefined {
  return event.id;
}
