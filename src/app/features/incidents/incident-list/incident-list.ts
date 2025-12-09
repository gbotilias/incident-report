import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Incident } from '../../../core/models/incident.model';

@Component({
  selector: 'app-incident-list',
  imports: [DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './incident-list.html',
  styleUrl: './incident-list.scss',
})
export class IncidentListComponent {
  incidents = input<Incident[]>();
  showActions = input<boolean>();
  edit = output<Incident>();
  delete = output<Incident>();

  onEdit(incident: Incident): void {
    this.edit.emit(incident);
  }

  onDelete(incident: Incident): void {
    this.delete.emit(incident);
  }
}
