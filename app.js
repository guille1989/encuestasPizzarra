const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Conexión a MongoDB
mongoose.connect('mongodb+srv://root:123@cluster0.jwxt0.mongodb.net/encuestas?retryWrites=true&w=majority', {})
.then(() => console.log('MongoDB conectado')).catch(err => console.log(err));

// Modelo de Encuesta
const EncuestaSchema = new mongoose.Schema({
    pregunta: String,
    opciones: [String]
});
const Encuesta = mongoose.model('Encuesta', EncuestaSchema);

// Modelo de Respuesta
const RespuestaSchema = new mongoose.Schema({
    encuestaId: mongoose.Schema.Types.ObjectId,
    respuesta: String
});
const Respuesta = mongoose.model('Respuesta', RespuestaSchema);

// Ruta para obtener encuestas
app.get('/api/encuestas', async (req, res) => {
    const encuestas = await Encuesta.find();
    res.json(encuestas);
});

// Ruta para guardar respuestas
app.post('/responder', async (req, res) => {
    const { encuestaId, respuesta } = req.body;
    const nuevaRespuesta = new Respuesta({ encuestaId, respuesta });
    await nuevaRespuesta.save();
    res.json({ mensaje: 'Respuesta guardada' });
});

// Ruta para obtener estadísticas
app.get('/api/estadisticas/:id', async (req, res) => {
    const respuestas = await Respuesta.find({ encuestaId: req.params.id });
    const conteo = respuestas.reduce((acc, { respuesta }) => {
        acc[respuesta] = (acc[respuesta] || 0) + 1;
        return acc;
    }, {});
    res.json(conteo);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
