import { Injectable, signal } from '@angular/core';
import { mockIncidents } from '../data/incident.mock';
import { Incident } from '../models/incident.model';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  // Private signal for service state
  private incidentsSignal = signal<Incident[]>([...mockIncidents]);
  // Public readonly signal for external access
  incidents = this.incidentsSignal.asReadonly();

  addIncident(incident: Incident): void {
    const currentIncidents = this.incidentsSignal();
    const maxId = currentIncidents.length > 0 ? Math.max(...currentIncidents.map((i) => i.id)) : 0;

    const newIncident: Incident = {
      ...incident,
      id: maxId + 1,
    };

    this.incidentsSignal.update((incidents) => [...incidents, newIncident]);
  }

  updateIncident(updatedIncident: Incident): void {
    this.incidentsSignal.update((incidents) =>
      incidents.map((incident) => (incident.id === updatedIncident.id ? updatedIncident : incident))
    );
  }

  deleteIncident(id: number): void {
    this.incidentsSignal.update((incidents) => incidents.filter((incident) => incident.id !== id));
  }
}
