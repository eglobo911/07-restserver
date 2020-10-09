const express = require("express");

const {
  verificaToken,
  verificaAdmin_Role,
} = require("../middlewares/autenticacion");

let app = express();

let Categoria = require("../models/categoria");

// ============================
// Obtener todas las categorias
// ============================
app.get("/categoria", verificaToken, (req, res) => {
  Categoria.find({})
    .sort("descripcion")
    .populate("usuario", "nombre email")
    .exec((err, categorias) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        categorias,
      });
    });
});

// ============================
// Obtener una categoria por id
// ============================
app.get("/categoria/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Ese id no existe",
        },
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

// ============================
// Crear una nueva categoria
// ============================
app.post("/categoria", verificaToken, (req, res) => {
  let body = req.body;

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id,
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaDB) {
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
});

// ============================
// Actualizar una categoria
// ============================
app.put("/categoria/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  let descCategoria = {
    descripcion: body.descripcion,
  };

  Categoria.findByIdAndUpdate(
    id,
    descCategoria,
    { new: true, runValidators: true },
    (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error en base de datos",
        });
      }

      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          message: "Categoria no existe",
        });
      }

      res.json({
        ok: true,
        categoria: categoriaDB,
      });
    }
  );
});

// ============================
// Borrar una categoria
// ============================
app.delete(
  "/categoria/:id",
  [verificaToken, verificaAdmin_Role],
  (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Ese id no existe",
          },
        });
      }

      res.json({
        ok: true,
        message: "Categoria borrada",
      });
    });
  }
);

module.exports = app;
