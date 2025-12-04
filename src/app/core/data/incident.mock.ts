import { IncidentStatus } from '../enums/incident-status.enum';
import { Incident } from '../models/incident.model';

export const mockIncidents: Incident[] = [
  {
    id: 1,
    studentName: 'John Doe',
    status: IncidentStatus.OPEN,
    title: 'Late Submission',
    description: 'The student submitted the assignment late.',
    date: 1627849200000,
  },
  {
    id: 2,
    studentName: 'Jane Smith',
    status: IncidentStatus.IN_PROGRESS,
    title: 'Plagiarism Issue',
    description: 'The student is under investigation for plagiarism.',
    date: 1627935600000,
  },
  {
    id: 3,
    studentName: 'Alice Johnson',
    status: IncidentStatus.RESOLVED,
    title: 'Attendance Problem',
    description: 'The attendance issue has been resolved.',
    date: 1628022000000,
  },
];
