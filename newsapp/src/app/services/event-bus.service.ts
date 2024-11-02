import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface EventData {
  name: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private subject = new Subject<EventData>();

  emit(event: EventData) {
    console.log(`EventBus emitting event: ${event.name}`, event.data);
    this.subject.next(event);
  }
  
  on(eventName: string): Observable<any> {
    console.log(`EventBus listening for event: ${eventName}`);
    return this.subject.asObservable().pipe(
      filter(event => event.name === eventName),
      map(event => {
        console.log(`EventBus detected event: ${event.name}`, event.data);
        return event.data;
      })
    );
  }
  
}
