const express = require('express');
const { Usuario, Propiedad, Evento } = require('./models');

const router = express.Router();

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/usuarios', async (req, res) => {
    try {
        const result = await Usuario.findAll();
        res.json(result);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

router.post('/usuarios', async (req, res) => {
    const { nombre, email } = req.body;
    try {
        const usuario = await Usuario.create({ nombre, email });
        res.status(201).json(usuario);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCount = await Usuario.destroy({ where: { id } });
        if (deletedCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Editar un usuario
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario a editar
 *         schema:
 *           type: integer
 *       - name: usuario
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *             email:
 *               type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, email } = req.body;
    try {
        const [updated] = await Usuario.update({ nombre, email }, { where: { id } });
        if (updated) {
            const updatedUsuario = await Usuario.findOne({ where: { id } });
            return res.status(200).json(updatedUsuario);
        }
        return res.status(404).json({ error: 'Usuario no encontrado' });
    } catch (error) {
        console.error('Error al editar usuario:', error);
        res.status(500).json({ error: 'Error al editar usuario' });
    }
});

/**
 * @swagger
 * /propiedades:
 *   get:
 *     summary: Obtener todas las propiedades
 *     responses:
 *       200:
 *         description: Lista de propiedades
 */
router.get('/propiedades', async (req, res) => {
    try {
        const result = await Propiedad.findAll();
        res.json(result);
    } catch (error) {
        console.error('Error al obtener propiedades:', error);
        res.status(500).json({ error: 'Error al obtener propiedades' });
    }
});

/**
 * @swagger
 * /propiedades:
 *   get:
 *     summary: Obtener todas las propiedades
 *     responses:
 *       200:
 *         description: Lista de propiedades
 */
router.post('/propiedades', async (req, res) => {
    const { direccion, precio, habitaciones, banos, superficie, tipo, vendedor, fechaPublicacion } = req.body;
    try {
        const propiedad = await Propiedad.create({ direccion, precio, habitaciones, banos, superficie, tipo, vendedor, fechaPublicacion });
        res.status(201).json(propiedad);
    } catch (error) {
        console.error('Error al crear propiedad:', error);
        res.status(500).json({ error: 'Error al crear propiedad' });
    }
});

router.put('/propiedades/:id', async (req, res) => {
    const { id } = req.params;
    const { direccion, precio, habitaciones, banos, superficie, tipo, vendedor, fechaPublicacion } = req.body;
    try {
        const [updated] = await Propiedad.update({ direccion, precio, habitaciones, banos, superficie, tipo, vendedor, fechaPublicacion }, { where: { id } });
        if (updated) {
            const updatedPropiedad = await Propiedad.findOne({ where: { id } });
            return res.status(200).json(updatedPropiedad);
        }
        return res.status(404).json({ error: 'Propiedad no encontrada' });
    } catch (error) {
        console.error('Error al editar propiedad:', error);
        res.status(500).json({ error: 'Error al editar propiedad' });
    }
});

/**
 * @swagger
 * /propiedades/{id}:
 *   delete:
 *     summary: Eliminar una propiedad
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la propiedad a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Propiedad eliminada
 *       404:
 *         description: Propiedad no encontrada
 */
router.delete('/propiedades/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCount = await Propiedad.destroy({ where: { id } });
        if (deletedCount === 0) {
            return res.status(404).json({ error: 'Propiedad no encontrada' });
        }
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error al eliminar propiedad:', error);
        res.status(500).json({ error: 'Error al eliminar propiedad' });
    }
});

// Obtener todos los eventos
router.get('/eventos', async (req, res) => {
    try {
        const eventos = await Evento.findAll();
        res.json(eventos);
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).json({ error: 'Error al obtener eventos' });
    }
});

// Obtener un evento por ID
router.get('/eventos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const evento = await Evento.findOne({ where: { id } });
        if (evento) {
            return res.status(200).json(evento);
        }
        return res.status(404).json({ error: 'Evento no encontrado' });
    } catch (error) {
        console.error('Error al obtener evento:', error);
        res.status(500).json({ error: 'Error al obtener evento' });
    }
});

// Crear un nuevo evento
router.post('/eventos', async (req, res) => {
    const { titulo, descripcion, fechaInicio, fechaFin, ubicacion } = req.body;
    console.log('Datos recibidos en el backend:', req.body);
    try {
        const evento = await Evento.create({ 
            titulo, 
            descripcion, 
            fechaInicio: new Date(fechaInicio),
            fechaFin: new Date(fechaFin),
            ubicacion 
        });
        console.log('Evento creado:', evento.toJSON());
        res.status(201).json(evento);
    } catch (error) {
        console.error('Error al crear evento:', error);
        res.status(500).json({ error: 'Error al crear evento' });
    }
});

// Actualizar un evento
router.put('/eventos/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, fechaInicio, fechaFin, ubicacion } = req.body;
    try {
        const [updated] = await Evento.update({ titulo, descripcion, fechaInicio, fechaFin, ubicacion }, { where: { id } });
        if (updated) {
            const updatedEvento = await Evento.findOne({ where: { id } });
            return res.status(200).json(updatedEvento);
        }
        return res.status(404).json({ error: 'Evento no encontrado' });
    } catch (error) {
        console.error('Error al actualizar evento:', error);
        res.status(500).json({ error: 'Error al actualizar evento' });
    }
});

// Eliminar un evento
router.delete('/eventos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCount = await Evento.destroy({ where: { id } });
        if (deletedCount === 0) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        res.status(500).json({ error: 'Error al eliminar evento' });
    }
});

module.exports = router;