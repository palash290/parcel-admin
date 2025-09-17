import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
      constructor(private router: Router) { }

      setValues(token: string, roleUUID: string,userInfo: any) {
            localStorage.setItem('token', token)
            localStorage.setItem('role_uuid', roleUUID);
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
      }

      getToken() {
            return localStorage.getItem('parcelAdminToken')
      };

      getUserInfo() {
            return JSON.parse(localStorage.getItem('userInfo') || '{}');
      }

      isLogedIn() {
            return this.getToken() !== null
      }

      logout(): void {
            localStorage.clear();
            this.router.navigateByUrl('/');
      };

      getRoleUUID(): string | null {
            return localStorage.getItem('role_uuid');
      }
}