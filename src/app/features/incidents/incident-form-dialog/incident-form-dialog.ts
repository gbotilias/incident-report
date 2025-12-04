import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IncidentStatus } from '../../../core/enums/incident-status.enum';
import { Incident } from '../../../core/models/incident.model';

export interface IncidentFormDialogData {
  incident?: Incident;
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-incident-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  templateUrl: './incident-form-dialog.html',
  styleUrl: './incident-form-dialog.scss',
})
export class IncidentFormDialogComponent {
  // Dialog reference for closing and returning data
  private readonly dialogRef = inject(MatDialogRef<IncidentFormDialogComponent>);
  private readonly fb = inject(FormBuilder);
  // Data passed from parent component (incident for edit mode, or just mode flag for create)
  readonly data = inject<IncidentFormDialogData>(MAT_DIALOG_DATA);

  // Extract all status values from enum for dropdown options
  readonly statuses = Object.values(IncidentStatus);

  // Reactive form with validation
  // Pre-populate fields if editing, otherwise use defaults
  readonly form = this.fb.group({
    studentName: [this.data.incident?.studentName || '', Validators.required],
    title: [this.data.incident?.title || '', Validators.required],
    description: [this.data.incident?.description || '', Validators.required],
    status: [this.data.incident?.status || IncidentStatus.OPEN, Validators.required],
    date: [
      this.data.incident?.date ? new Date(this.data.incident.date) : new Date(),
      Validators.required,
    ],
  });

  /**
   * Determines if the dialog is in edit mode (vs create mode)
   * Used to change UI text and behavior
   */
  get isEditMode(): boolean {
    return this.data.mode === 'edit';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const result: Partial<Incident> = {
        studentName: formValue.studentName ?? undefined,
        title: formValue.title ?? undefined,
        description: formValue.description ?? undefined,
        status: formValue.status ?? undefined,
        date: formValue.date ? new Date(formValue.date).getTime() : Date.now(),
      };

      if (this.isEditMode && this.data.incident) {
        result.id = this.data.incident.id;
      }

      this.dialogRef.close(result);
    }
  }
}
