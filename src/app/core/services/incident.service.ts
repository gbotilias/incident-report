import { Injectable, signal } from '@angular/core';
import { mockIncidents } from '../data/incident.mock';
import { Incident } from '../models/incident.model';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  // Private writable signal for internal state management
  private incidentsSignal = signal<Incident[]>([...mockIncidents]);

  // Public readonly signal to prevent external mutations
  // Components can read but cannot modify the state directly
  incidents = this.incidentsSignal.asReadonly();

  /**
   * Adds a new incident to the collection
   * Automatically generates a unique ID based on the highest existing ID
   * @param incident - Incident data without ID
   */
  addIncident(incident: Omit<Incident, 'id'>): void {
    const newIncident: Incident = {
      ...incident, // Spread all properties from the input
      // Generate new ID: find max existing ID and add 1, or start from 1 if empty
      id: Math.max(...this.incidentsSignal().map((i) => i.id), 0) + 1,
    };
    // Update signal with new array containing all existing incidents plus the new one
    this.incidentsSignal.update((incidents) => [...incidents, newIncident]);
  }

  /**
   * Updates an existing incident in the collection
   * @param updatedIncident - The incident with updated data (must include id)
   */
  updateIncident(updatedIncident: Incident): void {
    // Map through incidents and replace the one with matching ID
    this.incidentsSignal.update((incidents) =>
      incidents.map((incident) => (incident.id === updatedIncident.id ? updatedIncident : incident))
    );
  }

  /**
   * Removes an incident from the collection by ID
   * @param id - The ID of the incident to delete
   */
  deleteIncident(id: number): void {
    // Filter out the incident with the matching ID
    this.incidentsSignal.update((incidents) => incidents.filter((incident) => incident.id !== id));
  }
}
