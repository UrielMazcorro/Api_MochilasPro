// backend/server.js
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

// Inicialización de Firebase Admin SDK con la ruta correcta
const serviceAccount = path.join(__dirname, 'mi-app-firebase-adminsdk.json'); // Ruta al archivo JSON

// Inicializando la app de Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://mochilaspro-eee74.firebaseio.com', // URL de tu base de datos
});

// Configuración del servidor Express
const app = express();
app.use(cors()); // Para permitir solicitudes desde otros dominios
app.use(express.json()); // Para manejar el cuerpo de las solicitudes en formato JSON

// Importar las rutas de mochilas
const mochilasRoutes = require('./routes/mochilas');

// Usar las rutas de mochilas en la aplicación
app.use('/api/mochilas', mochilasRoutes);

// Configurar el puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
