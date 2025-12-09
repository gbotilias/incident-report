import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Incident } from '../models/incident.model';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  sendIncidentCreatedEmail(incident: Incident, recipientEmail: string): Observable<string> {
    return this.simulateEmailSend(
      recipientEmail,
      'New Incident Created',
      `A new incident has been created:\n\nTitle: ${incident.title}\nStudent: ${incident.studentName}\nStatus: ${incident.status}`
    );
  }

  sendIncidentUpdatedEmail(incident: Incident, recipientEmail: string): Observable<string> {
    return this.simulateEmailSend(
      recipientEmail,
      'Incident Updated',
      `An incident has been updated:\n\nTitle: ${incident.title}\nStudent: ${incident.studentName}\nStatus: ${incident.status}`
    );
  }

  sendIncidentDeletedEmail(incidentTitle: string, recipientEmail: string): Observable<string> {
    return this.simulateEmailSend(
      recipientEmail,
      'Incident Deleted',
      `An incident has been deleted:\n\nTitle: ${incidentTitle}`
    );
  }

  private simulateEmailSend(to: string, subject: string, body: string): Observable<string> {
    console.log('Mock Email Sent:');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log('---');

    return of(`Email sent to ${to}`).pipe(delay(500));
  }
}
