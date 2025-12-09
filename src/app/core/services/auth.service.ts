import { computed, Injectable, signal } from '@angular/core';
import { UserRole } from '../enums/user-role.enum';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly mockUsers: User[] = [
    { id: 0, name: 'Teacher', role: UserRole.TEACHER },
    { id: 1, name: 'Viewer', role: UserRole.VIEWER },
  ];

  // Private signal for service state
  private currentUserSignal = signal<User>(this.mockUsers[0]);
  // Public readonly signal for external access
  readonly currentUser = this.currentUserSignal.asReadonly();
  // True for Teacher role, false for Viewer role
  readonly canModifyIncidents = computed(() => this.currentUserSignal()?.role === UserRole.TEACHER);

  loginAs(role: UserRole): void {
    const user = this.mockUsers.find((u) => u.role === role);
    if (user) {
      this.currentUserSignal.set(user);
    }
  }
}
