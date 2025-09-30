import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.getUserData(user.uid);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  async register(email: string, password: string, displayName: string): Promise<boolean> {
    const loading = await this.loadingController.create({
      message: 'Creando cuenta...'
    });
    await loading.present();

    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      
      if (credential.user) {
        const userData: User = {
          uid: credential.user.uid,
          email: email,
          displayName: displayName,
          photoURL: '',
          createdAt: new Date()
        };

        await this.firestore.collection('users').doc(credential.user.uid).set(userData);
        this.currentUserSubject.next(userData);
        
        await loading.dismiss();
        this.showToast('Cuenta creada exitosamente', 'success');
        this.router.navigate(['/tabs']);
        return true;
      }
    } catch (error: any) {
      await loading.dismiss();
      this.showToast(this.getErrorMessage(error.code), 'danger');
    }
    
    await loading.dismiss();
    return false;
  }

  async login(email: string, password: string): Promise<boolean> {
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...'
    });
    await loading.present();

    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      await loading.dismiss();
      this.showToast('Bienvenido a DrMoto', 'success');
      this.router.navigate(['/tabs']);
      return true;
    } catch (error: any) {
      await loading.dismiss();
      this.showToast(this.getErrorMessage(error.code), 'danger');
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
      this.showToast('Sesión cerrada', 'success');
    } catch (error) {
      this.showToast('Error al cerrar sesión', 'danger');
    }
  }

  async resetPassword(email: string): Promise<boolean> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
      this.showToast('Email de recuperación enviado', 'success');
      return true;
    } catch (error: any) {
      this.showToast(this.getErrorMessage(error.code), 'danger');
      return false;
    }
  }

  private async getUserData(uid: string): Promise<void> {
    try {
      const doc = await this.firestore.collection('users').doc(uid).get().toPromise();
      if (doc && doc.exists) {
        const userData = doc.data() as User;
        this.currentUserSubject.next(userData);
      }
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
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

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/email-already-in-use':
        return 'El email ya está registrado';
      case 'auth/weak-password':
        return 'La contraseña es muy débil';
      case 'auth/invalid-email':
        return 'Email inválido';
      default:
        return 'Error de autenticación';
    }
  }
}