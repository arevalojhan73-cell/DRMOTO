
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://drmoto.com/api'; // Cambiar por tu API real
  private _storage: Storage | null = null;

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        switchMap((response: any) => {
          // Guardar token en almacenamiento local
          return from(this._storage!.set('auth_token', response.token))
            .pipe(map(() => response));
        })
      );
  }

  logout(): Observable<any> {
    return from(this._storage!.remove('auth_token'));
  }

  async getToken(): Promise<string | null> {
    return await this._storage?.get('auth_token');
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }
}