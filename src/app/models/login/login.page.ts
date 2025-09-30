import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials = {
    email: '',
    password: ''
  };

  showPassword = false;
  isLoading = false;
  showForgotModal = false;
  forgotEmail = '';
  isLoadingReset = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // Verificar si ya está autenticado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/tabs']);
    }
  }

  async onLogin() {
    if (!this.credentials.email || !this.credentials.password) {
      this.showToast('Por favor completa todos los campos', 'warning');
      return;
    }

    if (!this.isValidEmail(this.credentials.email)) {
      this.showToast('Por favor ingresa un email válido', 'warning');
      return;
    }

    this.isLoading = true;
    
    try {
      const success = await this.authService.login(
        this.credentials.email, 
        this.credentials.password
      );
      
      if (success) {
        // El servicio se encarga de la navegación
        this.credentials = { email: '', password: '' };
      }
    } catch (error) {
      this.showToast('Error al iniciar sesión', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  forgotPassword() {
    this.showForgotModal = true;
    this.forgotEmail = this.credentials.email;
  }

  async sendResetEmail() {
    if (!this.forgotEmail) {
      this.showToast('Por favor ingresa tu email', 'warning');
      return;
    }

    if (!this.isValidEmail(this.forgotEmail)) {
      this.showToast('Por favor ingresa un email válido', 'warning');
      return;
    }

    this.isLoadingReset = true;

    try {
      const success = await this.authService.resetPassword(this.forgotEmail);
      if (success) {
        this.showForgotModal = false;
        this.forgotEmail = '';
      }
    } catch (error) {
      this.showToast('Error enviando email de recuperación', 'danger');
    } finally {
      this.isLoadingReset = false;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    toast.present();
  }
}