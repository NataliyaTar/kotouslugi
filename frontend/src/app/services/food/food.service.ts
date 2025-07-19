import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private apiUrl = '/api/food'; // Используем относительный путь

  constructor(private http: HttpClient) { }

  getShops() {
    return this.http.get<any[]>(`${this.apiUrl}/shops`);
  }

  getProducts(shopId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/products?shopId=${shopId}`);
  }

  createOrder(orderData: any) {
    const backendOrder = {
      catId: orderData.cat.id,
      ownerName: orderData.ownerName,
      telephone: orderData.telephone,
      email: orderData.email,
      city: orderData.address.city,
      street: orderData.address.street,
      house: orderData.address.house,
      apartment: orderData.address.apartment,
      shopId: orderData.shopId,
      deliveryDate: orderData.deliveryDate,
      deliveryTime: orderData.deliveryTime,
      comment: orderData.comment
    };

    return this.http.post(`${this.apiUrl}/order`, backendOrder);
  }
}
