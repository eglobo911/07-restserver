const express = require("express");

const { verificaToken } = require("../middlewares/autenticacion");

let app = express();

let Producto = require("../models/producto");
const producto = require("../models/producto");

// ============================
// Obtener todaos los productos
// ============================
app.get("/producto", verificaToken, (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  Producto.find({ disponible: true })
    .skip(desde)
    .limit(5)
    .sort("nombre")
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        productos,
      });
    });
});

// ============================
// Obtener un producto por id
// ============================
app.get("/producto/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  Producto.findById(id)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "El ID no existe",
          },
        });
      }
      res.json({
        ok: true,
        producto: productoDB,
      });
    });
});

// ============================
// Buscar un producto
// ============================
app.get("/producto/buscar/:termino", verificaToken, (req, res) => {
  let termino = req.params.termino;

  Producto.find({ nombre: termino })
    .populate("categoria", "nombre")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        productos,
      });
    });
});

// ============================
// Crear un producto
// ============================
app.post("/producto", verificaToken, (req, res) => {
  let body = req.body;

  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: req.usuario._id,
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      producto: productoDB,
    });
  });
});

// ============================
// Actualizar un producto por id
// ============================
app.put("/producto/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El id no existe",
        },
      });
    }

    productoDB.nombre = body.nombre;
    productoDB.precioUni = body.precioUni;
    productoDB.descripcion = body.descripcion;

    productoDB.save((err, productoGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        producto: productoGuardado,
      });
    });
  });
});

// ============================
// Borrar un producto por id
// ============================
app.delete("/producto/:id", (req, res) => {
  // cambiar a falso el status del campo 'disponible'
  let id = req.params.id;

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El id no existe",
        },
      });
    }

    productoDB.disponible = false;

    productoDB.save((err, productoBorrado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        producto: productoBorrado,
        message: "Producto borrado",
      });
    });
  });
});

module.exports = app;
