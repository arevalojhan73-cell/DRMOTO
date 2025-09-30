import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CartItem extends Product {
  subtotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _storage: Storage | null = null;
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartItems.asObservable();
  
  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    await this.loadCart();
  }

  async loadCart() {
    const items = await this._storage?.get('cart_items') || [];
    this.cartItems.next(items);
  }

  async addToCart(product: Product) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.subtotal = existingItem.price * existingItem.quantity;
    } else {
      const newItem: CartItem = {
        ...product,
        quantity: 1,
        subtotal: product.price
      };
      currentItems.push(newItem);
    }

    await this.saveCart(currentItems);
  }

  async removeFromCart(productId: number) {
    const currentItems = this.cartItems.value.filter(item => item.id !== productId);
    await this.saveCart(currentItems);
  }

  async updateQuantity(productId: number, quantity: number) {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => item.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        await this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        item.subtotal = item.price * quantity;
        await this.saveCart(currentItems);
      }
    }
  }

  async clearCart() {
    await this.saveCart([]);
  }

  private async saveCart(items: CartItem[]) {
    await this._storage?.set('cart_items', items);
    this.cartItems.next(items);
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => total + item.subtotal, 0);
  }

  getItemCount(): number {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
  }
}