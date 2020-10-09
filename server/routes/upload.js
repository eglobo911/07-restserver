const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

const Usuario = require("../models/usuario");
const Producto = require("../models/producto");

const fs = require("fs");
const path = require("path");

// default options
app.use(fileUpload());

app.put("/upload/:folder/:id", function (req, res) {
  let folder = req.params.folder;
  let id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No files were uploaded.",
      },
    });
  }

  // Valida tipo
  let tiposValidos = ["productos", "usuarios"];
  if (tiposValidos.indexOf(folder) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        //ext: extension,
        message:
          "Archivo no subido, se recibio un folder invalido, los folders permitidos son " +
          tiposValidos.join(", "),
      },
    });
  }

  let archivo = req.files.archivo;
  let nombreCortado = archivo.name.split(".");
  let extension = nombreCortado[nombreCortado.length - 1];

  //console.log(extension);

  // Extensiones permitidas
  let extensionesValidas = ["png", "jpg", "gif", "jpeg"];

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        ext: extension,
        message:
          "Archivo no subido, las Ext permitidas son " +
          extensionesValidas.join(", "),
      },
    });
  }

  // cambiar nombre al archivo
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  archivo.mv(`uploads/${folder}/${nombreArchivo}`, (err) => {
    if (err)
      return res.status(500).json({
        ok: false,
        err,
      });

    // Aqui imagen cargada
    if (folder === "usuarios") {
      imagenUsuario(id, res, nombreArchivo, folder);
    } else {
      imagenProducto(id, res, nombreArchivo, folder);
    }
  });
});

function imagenUsuario(id, res, nombreArchivo, folder) {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borraArchivo(nombreArchivo, folder);
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!usuarioDB) {
      borraArchivo(nombreArchivo, folder);
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no existe",
        },
      });
    }

    borraArchivo(usuarioDB.img, folder);

    usuarioDB.img = nombreArchivo;

    usuarioDB.save((err, usuarioGuardado) => {
      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo,
      });
    });
  });
}

function imagenProducto(id, res, nombreArchivo, folder) {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      borraArchivo(nombreArchivo, folder);
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      borraArchivo(nombreArchivo, folder);
      return res.status(400).json({
        ok: false,
        err: {
          message: "Producto no existe",
        },
      });
    }

    borraArchivo(productoDB.img, folder);

    productoDB.img = nombreArchivo;

    productoDB.save((err, productoGuardado) => {
      res.json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo,
      });
    });
  });
}

function borraArchivo(nombreImagen, folder) {
  let pathImagen = path.resolve(
    __dirname,
    `../../uploads/${folder}/${nombreImagen}`
  );
  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}

module.exports = app;
