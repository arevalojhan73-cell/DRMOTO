import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;

  constructor(
    private cartService: CartService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.cartTotal = this.cartService.getCartTotal();
    });
  }

  async updateQuantity(item: CartItem, event: any) {
    const quantity = parseInt(event.detail.value);
    await this.cartService.updateQuantity(item.id, quantity);
  }

  async removeItem(item: CartItem) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: `¿Desea eliminar ${item.name} del carrito?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.cartService.removeFromCart(item.id);
          }
        }
      ]
    });

    await alert.present();
  }

  async clearCart() {
    const alert = await this.alertController.create({
      header: 'Vaciar Carrito',
      message: '¿Está seguro de que desea vaciar todo el carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Vaciar',
          handler: async () => {
            await this.cartService.clearCart();
          }
        }
      ]
    });

    await alert.present();
  }

  async checkout() {
    if (this.cartItems.length === 0) {
      const alert = await this.alertController.create({
        header: 'Carrito Vacío',
        message: 'Agregue productos al carrito antes de continuar.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Procesando orden...'
    });
    await loading.present();

    try {
      const orderData = {
        items: this.cartItems,
        total: this.cartTotal,
        timestamp: new Date().toISOString()
      };

      this.productsService.createOrder(orderData).subscribe(
        async (response) => {
          await loading.dismiss();
          await this.cartService.clearCart();
          
          const alert = await this.alertController.create({
            header: 'Orden Exitosa',
            message: `Su orden #${response.orderId} ha sido procesada exitosamente.`,
            buttons: [{
              text: 'OK',
              handler: () => {
                this.router.navigate(['/home']);
              }
            }]
          });
          await alert.present();
        },
        async (error) => {
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Hubo un problema al procesar su orden. Por favor intente nuevamente.',
            buttons: ['OK']
          });
          await alert.present();
        }
      );
    } catch (error) {
      await loading.dismiss();
      console.error('Error en checkout:', error);
    }
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }
}