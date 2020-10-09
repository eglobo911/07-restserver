const express = require("express");
const fs = require("fs");
let app = express();
const path = require("path");

app.get("/imagen/:tipo/:img", (req, res) => {
  let tipo = req.params.tipo;
  let img = req.params.img;

  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
  if (fs.existsSync(pathImagen)) {
    res.sendFile(pathImagen);
  } else {
    let beautyPath = path.resolve(__dirname, "../assets/beauty.jpg");
    res.sendFile(beautyPath);
  }
});

module.exports = app;
