import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  private readonly purchaseUrl = 'http://localhost:8080/api/checkout/purchase';

  constructor() { }

  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }
}
