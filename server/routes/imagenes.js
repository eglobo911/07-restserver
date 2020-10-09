const express = require("express");
const fs = require("fs");
let app = express();
const path = require("path");
const { verificaTokenImg } = require("../middlewares/autenticacion");

app.get("/imagen/:tipo/:img", verificaTokenImg, (req, res) => {
  let tipo = req.params.tipo;
  let img = req.params.img;

  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
  if (fs.existsSync(pathImagen)) {
    res.sendFile(pathImagen);
  } else {
    let beautyPath = path.resolve(__dirname, "../assets/awsome.jpg");
    res.sendFile(beautyPath);
  }
});

module.exports = app;
