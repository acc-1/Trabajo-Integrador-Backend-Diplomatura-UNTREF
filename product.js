import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const productoSchema = new Schema({
  codigo: {
    type: Number,
    required: true,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
});

const Producto = model('Producto', productoSchema);

export default Producto;
