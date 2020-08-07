const express = require("express");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require("../models/usuario");

const app = express();

app.post("/login", (req, res) => {
  let body = req.body;

  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "(Usuario) o contraseña incorrectos",
        },
      });
    }

    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario o (contraseña) incorrectos",
        },
      });
    }

    let token = jwt.sign(
      {
        usuario: usuarioDB,
      },
      "este-es-el-seed-desarrollo",
      { expiresIn: 60 * 60 * 24 * 30 }
    );

    res.json({
      ok: true,
      ususario: usuarioDB,
      token,
    });
  });
});

// configuraciones de google
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  const payload = ticket.getPayload();

  // console.log(payload.name);
  // console.log(payload.email);
  // console.log(payload.picture);

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
}

app.post("/google", async (req, res) => {
  let token = req.body.idtoken;

  let googleUser = await verify(token).catch((e) => {
    return res.status(403).json({
      ok: false,
      err: e,
    });
  });

  Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
    // en caso de error en la BD retornar codigo, false, y mensaje
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    //si el usuario ya existe en la BD
    if (usuarioDB) {
      // si campo google es 'false' entonces no es usuario google, y se retorna  error
      if (usuarioDB.google === false) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Debe usar autenticacion normal",
          },
        });

        // si campo google es 'true' es usuario google entonces generar nuevo token y devolver respuesta
      } else {
        let token = jwt.sign(
          {
            usuario: usuarioDB,
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );

        return res.json({
          ok: true,
          usuario: usuarioDB,
          token,
        });
      }

      // si el usuario no existe en la BD, entonces crear registro, grabarlo en BD,
    } else {
      let usuario = new Usuario();
      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ":)";

      usuario.save((err, usuarioDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }

        // si se grabo bien, generar un nuevo token y devolver objeto de usuario creado
        let token = jwt.sign(
          {
            usuario: usuarioDB,
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );

        return res.json({
          ok: true,
          usuario: usuarioDB,
          token,
        });
      });
    }
  });

  //   res.json({
  //     usuario: googleUser,
  //   });
});

module.exports = app;
