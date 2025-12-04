import { Injectable, signal } from '@angular/core';
import { UserRole } from '../enums/user-role.enum';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Mock users for demonstration
  private readonly mockUsers: User[] = [
    { id: 1, name: 'Admin User', email: 'admin@school.com', role: UserRole.ADMIN },
    { id: 2, name: 'Teacher John', email: 'teacher@school.com', role: UserRole.TEACHER },
    { id: 3, name: 'Viewer Jane', email: 'viewer@school.com', role: UserRole.VIEWER },
  ];

  // Current logged-in user signal (default: Teacher for demo)
  private currentUserSignal = signal<User | null>(this.mockUsers[1]);

  // Public readonly signal
  currentUser = this.currentUserSignal.asReadonly();

  /**
   * Mock login - switches between different user roles for testing
   * @param role - The role to login as
   */
  loginAs(role: UserRole): void {
    const user = this.mockUsers.find((u) => u.role === role);
    if (user) {
      this.currentUserSignal.set(user);
    }
  }

  /**
   * Logout - clears current user
   */
  logout(): void {
    this.currentUserSignal.set(null);
  }

  /**
   * Check if current user has permission to create/edit incidents
   * Only Admin and Teacher can create/edit
   */
  canModifyIncidents(): boolean {
    const user = this.currentUserSignal();
    return user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER;
  }

  /**
   * Check if current user has permission to delete incidents
   * Only Admin can delete
   */
  canDeleteIncidents(): boolean {
    const user = this.currentUserSignal();
    return user?.role === UserRole.ADMIN;
  }

  /**
   * Check if current user can view incidents
   * All authenticated users can view
   */
  canViewIncidents(): boolean {
    return this.currentUserSignal() !== null;
  }
}
