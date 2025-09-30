# DrMoto - Aplicación Móvil Híbrida de Galería Fotográfica

## 📱 Descripción del Proyecto

**DrMoto** es una aplicación móvil híbrida desarrollada con **Ionic/Angular** y **Capacitor** que permite a los usuarios capturar, almacenar y gestionar sus fotografías de manera segura, con sincronización en la nube mediante **Firebase**.

### Características Principales

- ✅ **Autenticación de usuarios** con Firebase Authentication
- 📷 **Captura de fotos** desde cámara o galería del dispositivo
- 🖼️ **Galería de fotos** con vista en cuadrícula responsive
- ☁️ **Almacenamiento en la nube** con Firebase Storage y Firestore
- 💾 **Almacenamiento local** con Capacitor Preferences
- 🔐 **Seguridad robusta** con reglas de Firebase
- 📱 **Soporte Android e iOS** mediante Capacitor
- 🎨 **Diseño moderno** con gradientes y animaciones

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Ionic Framework 7.0** - Framework UI multiplataforma
- **Angular 16.0** - Framework de desarrollo web
- **TypeScript 5.0** - Lenguaje de programación tipado
- **SCSS** - Preprocesador CSS para estilos

### Backend y Servicios
- **Firebase Authentication** - Autenticación de usuarios
- **Firebase Firestore** - Base de datos NoSQL en tiempo real
- **Firebase Storage** - Almacenamiento de archivos en la nube

### Capacitor Plugins
- **@capacitor/camera** - Acceso a cámara y galería
- **@capacitor/filesystem** - Sistema de archivos
- **@capacitor/preferences** - Almacenamiento local clave-valor
- **@capacitor/share** - Compartir contenido
- **@capacitor/splash-screen** - Pantalla de bienvenida
- **@capacitor/status-bar** - Personalización de barra de estado

---

## 📂 Estructura del Proyecto

```
drmoto/
├── src/
│   ├── app/
│   │   ├── guards/
│   │   │   └── auth.guard.ts              # Guard para proteger rutas
│   │   ├── models/
│   │   │   ├── user.model.ts              # Modelo de usuario
│   │   │   ├── photo.model.ts             # Modelo de foto
│   │   │   └── settings.model.ts          # Modelo de configuración
│   │   ├── pages/
│   │   │   ├── login/                     # Página de inicio de sesión
│   │   │   ├── register/                  # Página de registro
│   │   │   └── tabs/
│   │   │       ├── gallery/               # Galería de fotos
│   │   │       ├── camera/                # Captura de fotos
│   │   │       ├── profile/               # Perfil de usuario
│   │   │       └── settings/              # Configuración
│   │   ├── services/
│   │   │   ├── auth.service.ts            # Servicio de autenticación
│   │   │   ├── photo.service.ts           # Servicio de fotos
│   │   │   └── firebase.service.ts        # Servicio de Firebase
│   │   ├── app.component.ts               # Componente raíz
│   │   ├── app.module.ts                  # Módulo principal
│   │   └── app-routing.module.ts          # Configuración de rutas
│   ├── assets/
│   │   ├── images/                        # Imágenes de la app
│   │   └── icon/                          # Iconos
│   ├── environments/
│   │   ├── environment.ts                 # Configuración desarrollo
│   │   └── environment.prod.ts            # Configuración producción
│   ├── global.scss                        # Estilos globales
│   └── theme/
│       └── variables.scss                 # Variables de tema
├── android/                               # Proyecto Android nativo
├── ios/                                   # Proyecto iOS nativo
├── capacitor.config.ts                    # Configuración Capacitor
├── ionic.config.json                      # Configuración Ionic
├── package.json                           # Dependencias del proyecto
├── tsconfig.json                          # Configuración TypeScript
└── README.md                              # Este archivo
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js v16 o superior
- npm v8 o superior
- Ionic CLI: `npm install -g @ionic/cli`
- Android Studio (para desarrollo Android)
- Xcode (para desarrollo iOS, solo macOS)

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/drmoto.git
cd drmoto
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar Firebase

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar **Authentication** (Email/Password)
3. Crear base de datos **Firestore** en modo test
4. Habilitar **Storage**
5. Copiar la configuración de Firebase

6. Editar `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "TU_API_KEY",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "TU_APP_ID"
  }
};
```

### Paso 4: Configurar reglas de seguridad

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /photos/{photoId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Paso 5: Sincronizar Capacitor

```bash
npx cap sync
```

---

## 💻 Comandos de Desarrollo

### Servidor de desarrollo web

```bash
ionic serve
```

La aplicación se abrirá en `http://localhost:8100/`

### Desarrollo en dispositivo Android

```bash
# Construir la aplicación
ionic build

# Copiar recursos a Android
npx cap copy android

# Abrir en Android Studio
npx cap open android

# O ejecutar directamente
ionic capacitor run android -l --external
```

### Desarrollo en dispositivo iOS

```bash
# Construir la aplicación
ionic build

# Copiar recursos a iOS
npx cap copy ios

# Abrir en Xcode
npx cap open ios

# O ejecutar directamente
ionic capacitor run ios -l --external
```

---

## 📦 Compilación para Producción

### Android (APK/AAB)

```bash
# Construir para producción
ionic build --prod

# Copiar a Android
npx cap copy android

# Abrir Android Studio
npx cap open android
```

En Android Studio:
1. **Build** → **Generate Signed Bundle / APK**
2. Seleccionar **Android App Bundle (AAB)** para Play Store
3. O seleccionar **APK** para distribución directa
4. Configurar keystore y contraseñas
5. Seleccionar variante **release**
6. Generar bundle/APK

### iOS (IPA)

```bash
# Construir para producción
ionic build --prod

# Copiar a iOS
npx cap copy ios

# Abrir Xcode
npx cap open ios
```

En Xcode:
1. Seleccionar **Generic iOS Device** como destino
2. **Product** → **Archive**
3. Distribuir a **App Store Connect**
4. O exportar IPA para distribución Ad Hoc/Enterprise

---

## 🧪 Pruebas Realizadas

### Pruebas en Emulador

#### Android Emulator
- **Dispositivo**: Pixel 5 API 33
- **Resultados**: 
  - ✅ Captura de fotos funcional
  - ✅ Almacenamiento local operativo
  - ✅ Sincronización con Firebase correcta
  - ✅ Navegación fluida entre pantallas

#### iOS Simulator
- **Dispositivo**: iPhone 14 Pro (iOS 16.4)
- **Resultados**:
  - ✅ Permisos de cámara funcionando
  - ✅ Interfaz responsive adaptada
  - ✅ Gestos nativos implementados
  - ✅ Rendimiento óptimo

### Pruebas en Dispositivos Físicos

#### Android
- **Dispositivo**: Samsung Galaxy S21 (Android 13)
- **Pruebas**:
  - ✅ Autenticación con Firebase
  - ✅ Captura de fotos con cámara trasera/frontal
  - ✅ Selección desde galería
  - ✅ Edición y eliminación de fotos
  - ✅ Compartir fotos vía apps nativas
  - ✅ Funciona offline con almacenamiento local

#### iOS
- **Dispositivo**: iPhone 12 (iOS 16.2)
- **Pruebas**:
  - ✅ Login y registro funcionando
  - ✅ Acceso a cámara con permisos
  - ✅ Sincronización en tiempo real
  - ✅ Notificaciones push (preparadas)
  - ✅ Compatibilidad con Face ID

---

## 📊 Funcionalidades Implementadas

### Módulo de Autenticación
- [x] Registro de usuarios con email/password
- [x] Inicio de sesión
- [x] Recuperación de contraseña
- [x] Cierre de sesión
- [x] Validación de formularios
- [x] Protección de rutas con guards

### Módulo de Galería
- [x] Vista en cuadrícula de fotos
- [x] Vista detallada de foto individual
- [x] Edición de título y descripción
- [x] Eliminación de fotos
- [x] Compartir fotos
- [x] Búsqueda y filtros
- [x] Ordenamiento (fecha, título)
- [x] Estadísticas de galería

### Módulo de Cámara
- [x] Captura de fotos con cámara
- [x] Selección desde galería
- [x] Configuración de calidad
- [x] Modo de edición
- [x] Guardado automático
- [x] Vista previa de última foto

### Módulo de Perfil
- [x] Información del usuario
- [x] Cambio de avatar
- [x] Edición de nombre
- [x] Cambio de contraseña
- [x] Estadísticas de uso
- [x] Actividad reciente
- [x] Exportación de datos

### Módulo de Configuración
- [x] Tema claro/oscuro
- [x] Configuración de cámara
- [x] Opciones de almacenamiento
- [x] Privacidad y seguridad
- [x] Idioma de la aplicación
- [x] Gestión de caché
- [x] Información de la app

### Características Técnicas
- [x] Almacenamiento local con Capacitor Preferences
- [x] Sincronización con Firebase Firestore
- [x] Subida de imágenes a Firebase Storage
- [x] Compresión automática de imágenes
- [x] Manejo de estados de carga
- [x] Notificaciones toast
- [x] Diálogos de confirmación
- [x] Lazy loading de páginas
- [x] Optimización de rendimiento

---

## 🔒 Seguridad

### Implementaciones de Seguridad

1. **Autenticación robusta** con Firebase
2. **Reglas de seguridad** en Firestore y Storage
3. **Validación de datos** en cliente y servidor
4. **Protección de rutas** con guards de Angular
5. **Encriptación HTTPS** en todas las comunicaciones
6. **Tokens de sesión** gestionados automáticamente
7. **Permisos de dispositivo** solicitados correctamente

---

## 📈 Optimizaciones

### Rendimiento
- Lazy loading de módulos y páginas
- Compresión de imágenes antes de subir
- Caché de imágenes descargadas
- Paginación en listas largas
- Virtualización de listas (futuro)

### Experiencia de Usuario
- Indicadores de carga
- Mensajes de feedback inmediato
- Animaciones suaves
- Diseño responsive
- Modo offline funcional

---

## 🐛 Problemas Conocidos y Soluciones

### Problema: Cámara no funciona en iOS
**Solución**: Agregar permisos en `Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>Necesitamos acceso a la cámara para tomar fotos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Necesitamos acceso a las fotos</string>
```

### Problema: Build falla en Android
**Solución**: Verificar `build.gradle` y actualizar:
```gradle
compileSdkVersion 33
targetSdkVersion 33
```

---

## 🚧 Trabajo Futuro

- [ ] Integración con redes sociales
- [ ] Filtros y efectos para fotos
- [ ] Álbumes y colecciones
- [ ] Reconocimiento facial (etiquetado)
- [ ] Geolocalización de fotos
- [ ] Modo colaborativo (compartir álbumes)
- [ ] Búsqueda por contenido (IA)
- [ ] Versión web (PWA)

---

## 👥 Equipo de Desarrollo

- **Desarrollador Principal**: [Tu Nombre]
- **Diseño UI/UX**: [Nombre]
- **Testing**: [Nombre]

---

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 📞 Contacto y Soporte

- **Email**: soporte@drmoto.app
- **GitHub**: [https://github.com/tu-usuario/drmoto]([https://github.com/tu-usuario/drmoto](https://github.com/arevalojhan73-cell/DRMOTO))
- **Documentación**: [https://docs.drmoto.app]([https://docs.drmoto.app](https://drive.google.com/drive/folders/12IdRHj7P6wS-Qh3gvEGWnyipR2zfOjm5))

---

## 🙏 Agradecimientos

- Ionic Framework por la excelente documentación
- Firebase por los servicios gratuitos
- Comunidad de Angular por el soporte
- Capacitor por facilitar el desarrollo híbrido

---

**Versión**: 1.0.0  
**Última actualización**: Septiembre 2025
