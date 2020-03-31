//
// Puerto
//
process.env.PORT = process.env.PORT || 3000;


//
// Entorno
//
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//
// Base de datos
//
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://strider:w0RNQy3geNG6xKq2@cluster0-ehvg4.mongodb.net/cafe';
};

process.env.URLDB = urlDB;