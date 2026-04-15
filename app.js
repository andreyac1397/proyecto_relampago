require('dotenv').config();

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

const inicioRutas = require('./src/rutas/inicioRutas');
const autenticacionRutas = require('./src/rutas/autenticacionRutas');
const aspiranteRutas = require('./src/rutas/aspiranteRutas');
const encargadoRutas = require('./src/rutas/encargadoRutas');
const directorRutas = require('./src/rutas/directorRutas');
const { configurarVariablesGlobales } = require('./src/utilidades/vistaHelpers');
const manejoErroresMiddleware = require('./src/middlewares/manejoErroresMiddleware');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'vistas'));
app.set('layout', 'layouts/main');

app.use(expressLayouts);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'relampago-secreto',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 4 }
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(configurarVariablesGlobales);

app.use('/', inicioRutas);
app.use('/auth', autenticacionRutas);
app.use('/aspirante', aspiranteRutas);
app.use('/encargado', encargadoRutas);
app.use('/director', directorRutas);

app.use((req, res) => {
  res.status(404).render('errores/404', { titulo: 'Página no encontrada' });
});

app.use(manejoErroresMiddleware);

const puerto = process.env.PUERTO || 3000;
app.listen(puerto, () => {
  console.log(`Servidor ejecutándose en http://localhost:${puerto}`);
});

