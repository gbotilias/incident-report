import { Injectable, signal } from '@angular/core';
import { mockIncidents } from '../data/incident.mock';
import { Incident } from '../models/incident.model';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  private incidentsSignal = signal<Incident[]>([...mockIncidents]);
  incidents = this.incidentsSignal.asReadonly();

  addIncident(incident: Omit<Incident, 'id'>): void {
    const newIncident: Incident = {
      ...incident,
      id: Math.max(...this.incidentsSignal().map((i) => i.id), 0) + 1,
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
