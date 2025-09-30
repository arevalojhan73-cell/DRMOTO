import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { PhotoData } from '../models/photo.model';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
  photos: PhotoData[] = [];
  filteredPhotos: PhotoData[] = [];
  isLoading = false;
  
  // Modales
  showPhotoDetail = false;
  showEditModal = false;
  selectedPhoto: PhotoData | null = null;
  
  // Formulario de edición
  editForm = {
    title: '',
    description: ''
  };
  
  // Filtros y búsqueda
  searchTerm = '';
  sortBy: 'date' | 'title' = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';

  constructor(
    private photoService: PhotoService,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    await this.loadPhotos();
  }

  async ionViewWillEnter() {
    await this.loadPhotos();
  }

  async loadPhotos() {
    this.isLoading = true;
    try {
      await this.photoService.loadPhotos();
      this.photos = [...this.photoService.photos];
      this.applyFilters();
    } catch (error) {
      this.showToast('Error cargando las fotos', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async takePhoto() {
    const loading = await this.loadingController.create({
      message: 'Procesando foto...'
    });

    try {
      await this.photoService.addNewPhoto();
      await loading.present();
      
      // Recargar fotos después de tomar una nueva
      await this.loadPhotos();
      this.showToast('Foto guardada exitosamente', 'success');
    } catch (error) {
      this.showToast('Error capturando la foto', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async selectFromGallery() {
    const loading = await this.loadingController.create({
      message: 'Procesando foto...'
    });

    try {
      await this.photoService.selectFromGallery();
      await loading.present();
      
      // Recargar fotos después de seleccionar una
      await this.loadPhotos();
      this.showToast('Foto añadida exitosamente', 'success');
    } catch (error) {
      this.showToast('Error seleccionando la foto', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  openPhotoDetail(photo: PhotoData) {
    this.selectedPhoto = photo;
    this.showPhotoDetail = true;
  }

  closePhotoDetail() {
    this.showPhotoDetail = false;
    this.selectedPhoto = null;
  }

  editPhotoInfo() {
    if (this.selectedPhoto) {
      this.editForm = {
        title: this.selectedPhoto.title,
        description: this.selectedPhoto.description || ''
      };
      this.showEditModal = true;
    }
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editForm = { title: '', description: '' };
  }

  async savePhotoInfo() {
    if (!this.selectedPhoto || !this.editForm.title.trim()) {
      this.showToast('El título es requerido', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Guardando cambios...'
    });

    try {
      await loading.present();
      
      await this.photoService.updatePhotoInfo(
        this.selectedPhoto.id,
        this.editForm.title.trim(),
        this.editForm.description.trim()
      );

      // Actualizar la foto seleccionada
      this.selectedPhoto.title = this.editForm.title.trim();
      this.selectedPhoto.description = this.editForm.description.trim();

      // Recargar la lista
      await this.loadPhotos();
      
      this.showToast('Información actualizada', 'success');
      this.closeEditModal();
    } catch (error) {
      this.showToast('Error guardando los cambios', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async deletePhoto(photo: PhotoData, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar "${photo.title}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.performDelete(photo);
          }
        }
      ]
    });

    await alert.present();
  }

  private async performDelete(photo: PhotoData) {
    const loading = await this.loadingController.create({
      message: 'Eliminando foto...'
    });

    try {
      await loading.present();
      await this.photoService.deletePhoto(photo);
      await this.loadPhotos();
      
      this.showToast('Foto eliminada', 'success');
      
      // Cerrar modal si está abierto
      if (this.selectedPhoto?.id === photo.id) {
        this.closePhotoDetail();
      }
    } catch (error) {
      this.showToast('Error eliminando la foto', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async sharePhoto(photo: PhotoData, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    try {
      await Share.share({
        title: photo.title,
        text: photo.description || 'Compartido desde DrMoto',
        url: photo.url,
        dialogTitle: 'Compartir foto'
      });
    } catch (error) {
      this.showToast('Error compartiendo la foto', 'danger');
    }
  }

  async downloadPhoto(photo: PhotoData) {
    try {
      // Crear un enlace temporal para descargar
      const link = document.createElement('a');
      link.href = photo.url;
      link.download = `${photo.title}.${photo.metadata.format}`;
      link.click();
      
      this.showToast('Foto descargada', 'success');
    } catch (error) {
      this.showToast('Error descargando la foto', 'danger');
    }
  }

  onImageError(event: any, photo: PhotoData) {
    console.error('Error cargando imagen:', photo.id);
    event.target.src = 'assets/images/photo-placeholder.png';
  }

  applyFilters() {
    let filtered = [...this.photos];

    // Aplicar búsqueda
    if (this.searchTerm) {
      filtered = filtered.filter(photo =>
        photo.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (photo.description && photo.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (this.sortBy === 'date') {
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
      } else if (this.sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      }
      
      return this.sortOrder === 'desc' ? -comparison : comparison;
    });

    this.filteredPhotos = filtered;
  }

  openSearchModal() {
    // Implementar modal de búsqueda
    console.log('Abrir búsqueda');
  }

  openSortModal() {
    // Implementar modal de ordenamiento
    console.log('Abrir filtros');
  }

  trackByPhotoId(index: number, photo: PhotoData): string {
    return photo.id;
  }

  getTotalSize(): string {
    return `${this.photos.length} MB`; // Simplificado
  }

  getRecentPhotos(): number {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return this.photos.filter(photo => photo.createdAt > weekAgo).length;
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