import express from 'express';
import Producto from './product.js';
import { connectDB } from './database.js';
process.loadEnvFile()
connectDB();

const port = process.env.PORT ?? 3001

const app = express();

app.use(express.json());
function generarCodigoNumerico() {

  return Math.floor(1000 + Math.random() * 9000);
}

app.get('/', (req, res) => {
  res.send('Funciona correctamente');
});


// obtiene todos los productos
app.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
});


// obtiene los productos segun el id
app.get('/productos/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
});


// obtiene los productos segun el nombre, hace una busqueda parcial regex
app.get('/productos/nombre/:nombre', async (req, res) => {
  try {
    const nombre = req.params.nombre;
    const productos = await Producto.find({ nombre: { $regex: nombre, $options: 'i' } });

    if (productos.length === 0) {
      return res.status(404).json({ message: 'Productos no encontrados' });
    }

    res.json(productos);
  } catch (error) {
    console.error('Error al obtener los productos por nombre:', error);
    res.status(500).json({ message: 'Error al obtener los productos por nombre' });
  }
});


// crea un nuevo producto
app.post('/productos', async (req, res) => {
  try {

    const { nombre, precio, categoria } = req.body;

    //  validacion para que se proporcionen los datos necesarios
    if (!nombre || !precio || !categoria) {
      return res.status(400).json({ message: 'Nombre, precio y categoría son campos requeridos' });
    }

    // generar un codigo numerico para el nuevo producto
    const codigo = generarCodigoNumerico();


    const nuevoProducto = new Producto({
      codigo,
      nombre,
      precio,
      categoria
    });


    const productoGuardado = await nuevoProducto.save();


    res.status(201).json(productoGuardado);
  } catch (error) {
    console.error('Error al agregar un nuevo producto:', error);
    res.status(500).json({ message: 'Error al agregar un nuevo producto' });
  }
});


// actualiza precio de un producto por ID
app.patch('/productos/:id', async (req, res) => {
  try {
    const { precio } = req.body;

    // asegurarse de que se proporciona el precio
    if (!precio) {
      return res.status(400).json({ message: 'El precio es un campo requerido' });
    }

    // buscar el producto por ID y actualizar el precio
    const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, { precio }, { new: true });

    if (!productoActualizado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(productoActualizado);
  } catch (error) {
    console.error('Error al actualizar el precio del producto:', error);
    res.status(500).json({ message: 'Error al actualizar el precio del producto' });
  }
});


// elimina un producto por ID
app.delete('/productos/:id', async (req, res) => {
  try {
    // Buscar el producto por ID y eliminarlo
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);

    if (!productoEliminado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Devolver el producto eliminado como respuesta
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
});


// manejo de errores para rutas no existentes
app.use((req, res) => {
  res.status(404).send('404 por aca no hay nada');
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
  console.log(`App listening on${port}`);

export default app;



