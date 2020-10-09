const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

// default options
app.use(fileUpload());

app.put("/upload", function (req, res) {
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No files were uploaded.",
      },
    });
  }

  let archivo = req.files.archivo;
  let nombreCortado = archivo.name.split(".");
  let extension = nombreCortado[nombreCortado.length - 1];

  console.log(extension);

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

  archivo.mv(`uploads/${archivo.name}`, (err) => {
    if (err)
      return res.status(500).json({
        ok: false,
        err,
      });

    res.json({
      ok: true,
      message: "imagen subida correctamente",
    });
  });
});

module.exports = app;
