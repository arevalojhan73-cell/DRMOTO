// user.model.ts
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: Date;
  updatedAt?: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  cameraQuality: number;
  autoUpload: boolean;
  notifications: boolean;
}

// photo.model.ts
export interface PhotoData {
  id: string;
  userId: string;
  url: string;
  localPath: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date;
  metadata: PhotoMetadata;
  tags?: string[];
  location?: PhotoLocation;
}

export interface PhotoMetadata {
  width?: number;
  height?: number;
  format: string;
  size?: number;
  device?: string;
  camera?: CameraInfo;
}

export interface CameraInfo {
  make?: string;
  model?: string;
  lens?: string;
  settings?: CameraSettings;
}

export interface CameraSettings {
  iso?: number;
  aperture?: number;
  shutterSpeed?: number;
  flash?: boolean;
}

export interface PhotoLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

// gallery.model.ts
export interface GalleryOptions {
  sortBy: 'date' | 'title' | 'size';
  sortOrder: 'asc' | 'desc';
  filterBy?: 'all' | 'recent' | 'favorites';
  viewMode: 'grid' | 'list';
  itemsPerPage: number;
}

export interface GalleryStats {
  totalPhotos: number;
  totalSize: number;
  oldestPhoto?: Date;
  newestPhoto?: Date;
  averageSize: number;
}

// settings.model.ts
export interface AppSettings {
  general: GeneralSettings;
  camera: CameraSettings;
  storage: StorageSettings;
  sync: SyncSettings;
}

export interface GeneralSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  autoLock: boolean;
  biometricAuth: boolean;
}

export interface StorageSettings {
  autoUpload: boolean;
  uploadQuality: 'low' | 'medium' | 'high' | 'original';
  localStorageLimit: number;
  cloudBackup: boolean;
  autoDelete: boolean;
  autoDeleteDays: number;
}

export interface SyncSettings {
  autoSync: boolean;
  syncOnWiFiOnly: boolean;
  backgroundSync: boolean;
  syncFrequency: 'manual' | 'hourly' | 'daily' | 'weekly';
}