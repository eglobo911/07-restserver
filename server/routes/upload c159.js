const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

const Usuario = require("../models/usuario");

const fs = require("fs");
const path = require("path");

// default options
app.use(fileUpload());

app.put("/upload/:tipo/:id", function (req, res) {
  let tipo = req.params.tipo;
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
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        //ext: extension,
        message:
          "Archivo no subido, se recibio un tipo invalido, los tipos permitidos son " +
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

  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
    if (err)
      return res.status(500).json({
        ok: false,
        err,
      });

    // Aqqui imagen cargada
    imagenUsuario(id, res, nombreArchivo);
  });
});

function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borraArchivo(nombreArchivo, "usuarios");
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!usuarioDB) {
      borraArchivo(nombreArchivo, "usuarios");
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no existe",
        },
      });
    }

    // let pathImagen = path.resolve(
    //   __dirname,
    //   `../../uploads/usuarios/${usuarioDB.img}`
    // );
    // if (fs.existsSync(pathImagen)) {
    //   fs.unlinkSync(pathImagen);
    // }

    borraArchivo(usuarioDB.img, "usuarios");

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

function imagenProducto() {}

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
