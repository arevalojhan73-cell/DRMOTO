import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { PhotoData } from '../models/photo.model';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: PhotoData[] = [];
  private PHOTO_STORAGE: string = 'drmoto_photos';
  private platform: Platform;

  constructor(
    platform: Platform,
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {
    this.platform = platform;
  }

  public async addNewPhoto(): Promise<void> {
    try {
      // Capturar foto
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 90,
        allowEditing: true,
        width: 1024,
        height: 1024
      });

      if (capturedPhoto) {
        await this.savePhoto(capturedPhoto);
      }
    } catch (error) {
      console.error('Error capturando foto:', error);
      throw error;
    }
  }

  public async selectFromGallery(): Promise<void> {
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
        quality: 90,
        allowEditing: true,
        width: 1024,
        height: 1024
      });

      if (capturedPhoto) {
        await this.savePhoto(capturedPhoto);
      }
    } catch (error) {
      console.error('Error seleccionando foto:', error);
      throw error;
    }
  }

  private async savePhoto(photo: Photo): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Generar ID único para la foto
    const photoId = new Date().getTime().toString();
    
    // Leer el archivo como blob
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    // Subir a Firebase Storage
    const filePath = `photos/${user.uid}/${photoId}.jpg`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, blob);

    task.snapshotChanges().pipe(
      finalize(async () => {
        const downloadURL = await fileRef.getDownloadURL().toPromise();
        
        // Crear objeto PhotoData
        const photoData: PhotoData = {
          id: photoId,
          userId: user.uid,
          url: downloadURL,
          localPath: photo.webPath || '',
          title: `Foto ${this.photos.length + 1}`,
          description: '',
          createdAt: new Date(),
          metadata: {
            width: photo.width,
            height: photo.height,
            format: photo.format || 'jpeg'
          }
        };

        // Guardar en Firestore
        await this.firestore
          .collection('photos')
          .doc(photoId)
          .set(photoData);

        // Agregar a la galería local
        this.photos.unshift(photoData);
        
        // Guardar en storage local
        await this.saveToLocalStorage();
      })
    ).subscribe();
  }

  public async loadPhotos(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    try {
      // Cargar fotos desde Firestore
      const photosSnapshot = await this.firestore
        .collection('photos', ref => 
          ref.where('userId', '==', user.uid)
             .orderBy('createdAt', 'desc')
        )
        .get()
        .toPromise();

      this.photos = [];
      
      if (photosSnapshot) {
        photosSnapshot.forEach(doc => {
          const photoData = doc.data() as PhotoData;
          this.photos.push(photoData);
        });
      }

      // También cargar desde storage local como respaldo
      await this.loadFromLocalStorage();
    } catch (error) {
      console.error('Error cargando fotos:', error);
      // Si falla Firestore, cargar desde local
      await this.loadFromLocalStorage();
    }
  }

  public async deletePhoto(photo: PhotoData): Promise<void> {
    try {
      // Eliminar de Firebase Storage
      const fileRef = this.storage.ref(`photos/${photo.userId}/${photo.id}.jpg`);
      await fileRef.delete().toPromise();

      // Eliminar de Firestore
      await this.firestore.collection('photos').doc(photo.id).delete();

      // Eliminar de la galería local
      this.photos = this.photos.filter(p => p.id !== photo.id);
      
      // Actualizar storage local
      await this.saveToLocalStorage();
    } catch (error) {
      console.error('Error eliminando foto:', error);
      throw error;
    }
  }

  public async updatePhotoInfo(photoId: string, title: string, description: string): Promise<void> {
    try {
      const updates = {
        title,
        description,
        updatedAt: new Date()
      };

      // Actualizar en Firestore
      await this.firestore.collection('photos').doc(photoId).update(updates);

      // Actualizar en galería local
      const photoIndex = this.photos.findIndex(p => p.id === photoId);
      if (photoIndex !== -1) {
        this.photos[photoIndex] = { ...this.photos[photoIndex], ...updates };
      }

      // Actualizar storage local
      await this.saveToLocalStorage();
    } catch (error) {
      console.error('Error actualizando foto:', error);
      throw error;
    }
  }

  private async saveToLocalStorage(): Promise<void> {
    try {
      const photosToSave = this.photos.map(photo => ({
        ...photo,
        // Convertir fechas a strings para el storage
        createdAt: photo.createdAt.toISOString(),
        updatedAt: photo.updatedAt ? photo.updatedAt.toISOString() : undefined
      }));

      await Preferences.set({
        key: this.PHOTO_STORAGE,
        value: JSON.stringify(photosToSave)
      });
    } catch (error) {
      console.error('Error guardando en storage local:', error);
    }
  }

  private async loadFromLocalStorage(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
      
      if (value) {
        const savedPhotos = JSON.parse(value);
        // Convertir strings de fecha de vuelta a Date objects
        this.photos = savedPhotos.map((photo: any) => ({
          ...photo,
          createdAt: new Date(photo.createdAt),
          updatedAt: photo.updatedAt ? new Date(photo.updatedAt) : undefined
        }));
      }
    } catch (error) {
      console.error('Error cargando desde storage local:', error);
    }
  }

  public getPhotoCount(): number {
    return this.photos.length;
  }

  public getPhotosByDateRange(startDate: Date, endDate: Date): PhotoData[] {
    return this.photos.filter(photo => 
      photo.createdAt >= startDate && photo.createdAt <= endDate
    );
  }
}