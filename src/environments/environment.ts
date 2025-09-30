// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    projectId: 'drmoto-3ef71', // ID del proyecto desde la imagen
    appId: '1:663004420351:web:tu-app-id', // Reemplaza "tu-app-id" con el ID de tu app
    storageBucket: 'drmoto-3ef71.appspot.com', // Ajustado con el ID del proyecto
    locationId: 'us-central', // Puedes cambiarlo según tu región en Firebase
    apiKey: 'tu-api-key', // Obtén esto del firebaseConfig
    authDomain: 'drmoto-3ef71.firebaseapp.com', // Ajustado con el ID del proyecto
    messagingSenderId: '663004420351', // Número de proyecto desde la imagen
    measurementId: 'tu-measurement-id' // Obtén esto del firebaseConfig
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
