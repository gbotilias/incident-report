import { computed, Injectable, signal } from '@angular/core';
import { UserRole } from '../enums/user-role.enum';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly mockUsers: User[] = [
    { id: 1, name: 'Teacher', role: UserRole.TEACHER },
    { id: 2, name: 'Viewer', role: UserRole.VIEWER },
  ];

  private currentUserSignal = signal<User | null>(this.mockUsers[0]);
  readonly currentUser = this.currentUserSignal.asReadonly();

  readonly canModifyIncidents = computed(() => this.currentUserSignal()?.role === UserRole.TEACHER);

  loginAs(role: UserRole): void {
    const user = this.mockUsers.find((u) => u.role === role);
    if (user) {
      this.currentUserSignal.set(user);
    }
  }
}
