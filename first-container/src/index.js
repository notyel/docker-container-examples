import express from 'express';
import mongoose from 'mongoose';

// Conectar a la base de datos
mongoose.connect('mongodb://leyton:abc123456@localhost:27017/miapp?authSource=admin')
  .then(() => console.log('Conexión a la base de datos establecida'))
  .catch(err => console.error('Error al conectar a la base de datos:', err));

// Definir el esquema del modelo
const animalSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  estado: { type: String, required: true },
});

const Animal = mongoose.model('Animal', animalSchema);

const app = express();

// Middleware para análisis de JSON
app.use(express.json());

// Ruta para listar animales
app.get('/', async (_req, res) => {
  try {
    console.log('Listando animales...');
    const animales = await Animal.find();

    return res.json(animales);
  } catch (error) {
    console.error('Error al obtener animales:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para crear un nuevo animal
app.get('/crear', async (_req, res) => {
  try {
    const nuevoAnimal = await Animal.create({ tipo: 'Perro', estado: 'Ladrando' })
    return res.status(201).json(nuevoAnimal);
  } catch (error) {
    console.error('Error al crear animal:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado y escuchando en el puerto ${PORT}`);
});
