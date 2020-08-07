//
// Puerto
//
process.env.PORT = process.env.PORT || 3000;

//
// Entorno
//
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//
// Vencimiento del token
//

process.env.CADUCIDAD_TOKEN = "72h";
//
// SEED de autenticacion
//

process.env.SEED = process.env.SEED || "este-es-el-seed-desarrollo";

//
// Base de datos
//
let urlDB;

if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/cafe";
} else {
  urlDB = process.env.MONGO_URI;
}

//
// google client id
//

process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  "927207136285-1s592jaint5437qdu8keq1srimheb2hh.apps.googleusercontent.com";

process.env.URLDB = urlDB;
