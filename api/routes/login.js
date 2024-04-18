const express = require("express");
const router = express.Router();
const db = require("../db");

// Page d'authentification (non, plutôt une page d'accueil)
// Cette ressource aurait pu être servie sur l'URL racine /
router.get("/", async function (req, res, next) {
  const halRepresentation = {
    _links: {
      self: { href: "/login" },
      previous: {
        href: "/register",
        title: "register",
        description: "créer un compte",
      },
      next: {
        href: "/courts",
        title: "courts",
        description: "liste des terrains",
      },
      profile: { href: "/profile/user" },
      create: {
        href: "/login",
        method: "POST",
        title: "Se connecter",
        templated: false,
        description: "Permet de se connecter à son compte",
      },
    },
    message: "Bonjour, veuillez créer votre compte pour pouvoir réserver !",
  };

  //C'est une API RESTful, consommée par des programmes, il faut retourner du JSON et non du HTML !
  res.render("login", {
    _links: halRepresentation._links,
    message: halRepresentation.message,
  });
});

// Ce n'est pas de l'authentification mais de l'identification 
// Authentification de l'utilisateur (traitement du formulaire soumis)
router.post("/", async function (req, res, next) {
  const conn = await db.mysql.createConnection(db.dsn);

  const { username } = req.body;

  console.log("req.body:", req.body);
  console.log("username:", username);

  if (!username) {
    res.render("login", { error: "Veuillez fournir un nom d'utilisateur" });
    return;
  }

  try {
    const [rows] = await conn.execute(
      `SELECT * FROM User WHERE first_name = ?`,
      [username]
    );
    console.log("Rows:", rows);

    //Identification (l'utilisateur existe)
    if (rows.length > 0) {
      const user = rows[0];
      req.session.username = username;
      req.session.userId = user.id;
      res.redirect("/courts");
      // Redirige l'utilisateur vers la page d'accueil après la connexion
      res.render("login", {
        message: `vous êtes connecté ${username}`,
      });
    } else {
      res.render("login", { error: "Nom d'utilisateur incorrect" });
    }
  } catch (error) {
    console.error("Erreur de connexion : " + error.stack);
    res.status(500).json({
      msg: "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  } finally {
    conn.end();
  }
});

module.exports = router;
