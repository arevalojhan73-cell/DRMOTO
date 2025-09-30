import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { AuthService } from './services/auth.service';
import { PhotoService } from './services/photo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private photoService: PhotoService,
    private router: Router
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    // Verificar estado de autenticación al iniciar
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        // Usuario autenticado, cargar sus fotos
        this.photoService.loadPhotos();
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.configureStatusBar();
      this.hideSplashScreen();
      this.handleDeepLinks();
    });
  }

  private async configureStatusBar() {
    if (this.platform.is('capacitor')) {
      try {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#3880ff' });
      } catch (error) {
        console.log('Error configurando StatusBar:', error);
      }
    }
  }

  private async hideSplashScreen() {
    if (this.platform.is('capacitor')) {
      try {
        // Esperar un poco para que la app se cargue completamente
        setTimeout(async () => {
          await SplashScreen.hide();
        }, 2000);
      } catch (error) {
        console.log('Error ocultando SplashScreen:', error);
      }
    }
  }

  private handleDeepLinks() {
    // Manejar deep links para compartir fotos, etc.
    // Implementación básica
    if (this.platform.is('capacitor')) {
      // Escuchar eventos de deep links
      console.log('Deep links habilitados');
    }
  }
}