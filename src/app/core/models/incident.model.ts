import { IncidentStatus } from '../enums/incident-status.enum';

export interface Incident {
  id: number;
  studentName: string;
  status: IncidentStatus;
  title: string;
  description: string;
  date: number;
}
