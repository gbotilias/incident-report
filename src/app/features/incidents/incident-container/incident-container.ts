import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IncidentStatus } from '../../../core/enums/incident-status.enum';
import { UserRole } from '../../../core/enums/user-role.enum';
import { Incident } from '../../../core/models/incident.model';
import { AuthService } from '../../../core/services/auth.service';
import { IncidentService } from '../../../core/services/incident.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { IncidentFormDialogComponent } from '../incident-form-dialog/incident-form-dialog';
import { IncidentListComponent } from '../incident-list/incident-list';

@Component({
  selector: 'app-incident-container',
  imports: [
    IncidentListComponent,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './incident-container.html',
  styleUrl: './incident-container.scss',
})
export class IncidentContainerComponent {
  private readonly incidentService = inject(IncidentService);
  readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  // User roles enum for template access
  readonly UserRole = UserRole;

  // All available status options for filter dropdown
  readonly statuses = ['All', ...Object.values(IncidentStatus)];

  // Filter state signals
  readonly statusFilter = signal<string>('All');
  readonly studentFilter = signal<string>('');

  // Readonly signal from service - automatically updates UI when incidents change
  private readonly allIncidents = this.incidentService.incidents;

  /**
   * Computed signal that filters incidents based on status and student name
   * Automatically recalculates when filters or incidents change
   */
  readonly incidents = computed(() => {
    const status = this.statusFilter();
    const student = this.studentFilter().toLowerCase().trim();

    return this.allIncidents().filter(
      (incident) =>
        (status === 'All' || incident.status === status) &&
        (student === '' || incident.studentName.toLowerCase().includes(student))
    );
  });

  /**
   * Handles delete action from incident list
   * Shows confirmation dialog before deleting
   * @param incident - The incident to delete
   */
  onDeleteIncident(incident: Incident): void {
    // Open confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Incident',
        message: `Are you sure you want to delete incident "${incident.title}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    // Wait for user response
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.incidentService.deleteIncident(incident.id);
        // Show success notification
        this.snackBar.open('Incident deleted successfully', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  /**
   * Opens dialog to edit an existing incident
   * Pre-populates form with incident data
   * @param incident - The incident to edit
   */
  onEditIncident(incident: Incident): void {
    const dialogRef = this.dialog.open(IncidentFormDialogComponent, {
      data: {
        mode: 'edit',
        incident: incident,
      },
      width: '600px',
    });

    // Wait for dialog to close with result
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Update the incident in the service
        this.incidentService.updateIncident(result);
        // Show success notification
        this.snackBar.open('Incident updated successfully', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  /**
   * Opens dialog to create a new incident
   * Called when FAB button is clicked
   */
  onAddIncident(): void {
    const dialogRef = this.dialog.open(IncidentFormDialogComponent, {
      data: {
        mode: 'create',
      },
      width: '600px',
    });

    // Wait for dialog to close with result
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Add the new incident to the service
        this.incidentService.addIncident(result);
        // Show success notification
        this.snackBar.open('Incident created successfully', 'Close', {
          duration: 3000,
        });
      }
    });
  }
}
