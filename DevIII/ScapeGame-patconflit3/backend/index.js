const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const commentairesRoutes = require('./routes/commentaire');
const errorController = require('./controllers/error');
const scoreRoutes = require('./routes/score');
const scoresRoutes = require('./routes/scores')
const levelRoutes = require('./routes/level');

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

app.use('/auth', authRoutes);
app.use('/commentaire', commentairesRoutes);
app.use('/score', scoreRoutes);
app.use('/scores', scoresRoutes);
app.use('/level', levelRoutes);

app.use(errorController.get404);
app.use(errorController.get500);

const server = app.listen(ports, () => console.log(`écoute sur le port ${ports}`));

module.exports = server;