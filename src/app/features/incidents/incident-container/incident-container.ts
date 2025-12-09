import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { filter, switchMap } from 'rxjs';
import { IncidentStatus } from '../../../core/enums/incident-status.enum';
import { UserRole } from '../../../core/enums/user-role.enum';
import { Incident } from '../../../core/models/incident.model';
import { AuthService } from '../../../core/services/auth.service';
import { EmailService } from '../../../core/services/email.service';
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
  private readonly emailService = inject(EmailService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly statuses = ['All', ...Object.values(IncidentStatus)];

  readonly statusFilter = signal<string>('All');
  readonly studentFilter = signal<string>('');

  readonly currentUserName = computed(() => this.authService.currentUser()?.name || '');

  private readonly allIncidents = this.incidentService.incidents;

  readonly incidents = computed(() => {
    const status = this.statusFilter();
    const student = this.studentFilter().toLowerCase().trim();

    return this.allIncidents().filter(
      (incident) =>
        (status === 'All' || incident.status === status) &&
        (student === '' || incident.studentName.toLowerCase().includes(student))
    );
  });

  onDeleteIncident(incident: Incident): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Incident',
        message: `Are you sure you want to delete incident "${incident.title}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((confirmed) => !!confirmed),
        switchMap(() => {
          this.incidentService.deleteIncident(incident.id);
          return this.emailService.sendIncidentDeletedEmail(incident.title, incident.studentEmail);
        })
      )
      .subscribe((message) => {
        this.snackBar.open(`Incident deleted successfully. ${message}`, 'Close', {
          duration: 4000,
        });
      });
  }

  onEditIncident(incident: Incident): void {
    const dialogRef = this.dialog.open(IncidentFormDialogComponent, {
      data: {
        mode: 'edit',
        incident: incident,
      },
      width: '600px',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        switchMap((result) => {
          this.incidentService.updateIncident(result);
          return this.emailService.sendIncidentUpdatedEmail(result, result.studentEmail);
        })
      )
      .subscribe((message) => {
        this.snackBar.open(`Incident updated successfully. ${message}`, 'Close', {
          duration: 4000,
        });
      });
  }

  onAddIncident(): void {
    const dialogRef = this.dialog.open(IncidentFormDialogComponent, {
      data: {
        mode: 'create',
      },
      width: '600px',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        switchMap((result) => {
          this.incidentService.addIncident(result);
          return this.emailService.sendIncidentCreatedEmail(result, result.studentEmail);
        })
      )
      .subscribe((message) => {
        this.snackBar.open(`Incident created successfully. ${message}`, 'Close', {
          duration: 4000,
        });
      });
  }

  loginAsTeacher(): void {
    this.authService.loginAs(UserRole.TEACHER);
  }

  loginAsViewer(): void {
    this.authService.loginAs(UserRole.VIEWER);
  }
}
