import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'https://tu-api-backend.com/api'; // Cambiar por tu API real

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private async getHeaders(): Promise<HttpHeaders> {
    const token = await this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getProducts(): Observable<any> {
    return from(this.getHeaders()).pipe(
      switchMap(headers => this.http.get(`${this.apiUrl}/products`, { headers }))
    );
  }

  getProduct(id: number): Observable<any> {
    return from(this.getHeaders()).pipe(
      switchMap(headers => this.http.get(`${this.apiUrl}/products/${id}`, { headers }))
    );
  }

  getCategories(): Observable<any> {
    return from(this.getHeaders()).pipe(
      switchMap(headers => this.http.get(`${this.apiUrl}/categories`, { headers }))
    );
  }

  searchProducts(query: string): Observable<any> {
    return from(this.getHeaders()).pipe(
      switchMap(headers => 
        this.http.get(`${this.apiUrl}/products/search?q=${query}`, { headers })
      )
    );
  }

  createOrder(orderData: any): Observable<any> {
    return from(this.getHeaders()).pipe(
      switchMap(headers => 
        this.http.post(`${this.apiUrl}/orders`, orderData, { headers })
      )
    );
  }
}