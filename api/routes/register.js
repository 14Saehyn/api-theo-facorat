const express = require("express");
const router = express.Router();
const db = "../db";


//Cette
/*
 *Se créer un compte.
 */
router.get("/", function (req, res, next) {
  res.render("register", { message: "Bienvenue sur la page d'inscription" });
});

/*
 *route post pour ajouter un user
 */
router.post("/", function (req, res, next) {});
