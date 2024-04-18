var express = require("express");
var router = express.Router();
var db = require("../db");

/* GET home page. */
router.get("/", async function (req, res, next) {
  // #swagger.summary = "Page d'accueil"

  const conn = await db.mysql.createConnection(db.dsn);

  try {
    const [rows] = await conn.execute("SELECT * FROM User");

    const halRepresentation = {
      _links: {
        self: { href: "/", title: "accueil" },
        courts: { href: "/courts", title: "Liste des terrains de tennis" },
        // users: { href: "/users", title: "Liste des utilisateurs" },
        createUser: { href: "/register", title: "Créer un nouvel utilisateur" },
        login: { href: "/login", title: "Se connecter" },
        // Ajoutez d'autres liens vers les ressources selon vos besoins
      },
      title: "Accueil",
    };
    //Où est le fichier views/index ?
    //Soit supprimer la génération d'une vue HTML (elle est présente dans le starter à titre d'exemple)
    //soit créer le fichier, sinon erreur 500 sur la page d'accueil.
    // Passer halRepresentation à votre modèle Pug
    res.render("index", {
      title: halRepresentation.title,
      links: halRepresentation._links,
    });
  } catch (error) {
    console.error("Error connecting: " + error.stack);
    res.status(500).json({
      msg: "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  }
});

module.exports = router;
