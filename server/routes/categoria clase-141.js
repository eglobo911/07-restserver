const express = require("express");

const { verificaToken } = require("../middlewares/autenticacion");

let Categoria = require("../models/categoria");

let app = express();

// ============================
// Mostrar todas las categorias
// ============================
app.get("/categoria", (req, res) => {
  res.json("get todas las categorias");
});

// ============================
// Mostrar una categoria por id
// ============================
app.get("/categoria/:id", (req, res) => {
  //Categoria.findById()
  res.json("get una categoria por id");
});

// ============================
// Crear una nueva categoria
// ============================
app.post("/categoria", (req, res) => {
  // verificaToken,
  // regresa la nueva categoria
  // req.usuario._id
  let body = req.body;

  if (body.descripcion === undefined) {
    res.status(400).json({
      ok: false,
      mensaje: "Envie una descripcion",
    });
  } else {
    let categoria = new Categoria({
      descripcion: body.descripcion,
      usuario: body.usuario,
    });

    categoria.save((err, categoriaDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        categoria: categoriaDB,
      });
    });
  }
});

// ============================
// Actualizar una categoria
// ============================
app.put("/categoria/:id", (req, res) => {
  res.json("actualizar una categoria por id");
});

// ============================
// Borrar una categoria
// ============================
app.delete("/categoria/:id", (req, res) => {
  // solo un administrador puede borrar categorias
  // Categoria.findByIdAndRmove
  res.json("Borrar una categoria por id");
});

module.exports = app;
