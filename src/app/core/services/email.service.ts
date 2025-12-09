import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  sendEmail(recipientEmail: string): Observable<string> {
    return of(`Email sent to ${recipientEmail}`).pipe(delay(500));
  }
}
