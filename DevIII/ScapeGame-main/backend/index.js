const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const authRoutes = require('./routes/auth');
const commentairesRoutes = require('./routes/commentaire');
const errorController = require('./controllers/error');
const scoreRoutes = require('./routes/score');
const scoresRoutes = require('./routes/scores');
const levelRoutes = require('./routes/level');
const classementRoutes = require('./routes/classement');

const app = express();
const ports = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Acces-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Acces-Control-Allow-Headers', 'Content-Type, Authorization','Accept', 'X-Custom-Header');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Configuration Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Exemple d'annotation Swagger pour une route existante
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     responses:
 *       200:
 *         description: Successful login
 */
app.use('/auth', authRoutes);

/**
 * @swagger
 * /commentaire:
 *   get:
 *     summary: Get all comments
 *     responses:
 *       200:
 *         description: Successful response
 */
app.use('/commentaire', commentairesRoutes);

/**
 * @swagger
 * /score:
 *   get:
 *     summary: Get user score
 *     responses:
 *       200:
 *         description: Successful response
 */
app.use('/score', scoreRoutes);

/**
 * @swagger
 * /scores:
 *   get:
 *     summary: Get all scores
 *     responses:
 *       200:
 *         description: Successful response
 */
app.use('/scores', scoresRoutes);

/**
 * @swagger
 * /level:
 *   get:
 *     summary: Get level information
 *     responses:
 *       200:
 *         description: Successful response
 */
app.use('/level', levelRoutes);

/**
 * @swagger
 * /classement/{levelId}:
 *   get:
 *     summary: Get classement for a specific level
 *     parameters:
 *         description: The ID of the level
 *     responses:
 *       200:
 *         description: Successful response
 */
app.use('/classement', classementRoutes);



app.use(errorController.get404);
app.use(errorController.get500);

const server = app.listen(ports, () => console.log(`écoute sur le port ${ports}`));

module.exports = server;
