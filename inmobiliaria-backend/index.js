require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { initDb } = require('./models'); 
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); 

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

// Servir la documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Inicializar base de datos
initDb()
    .then(() => {
        console.log('Conexión a la base de datos establecida.');
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
    });

// Usar las rutas
app.use('/', routes);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
