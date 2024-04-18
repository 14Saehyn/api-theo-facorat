//Est-ce que ce test est suffisant ?
const checkIsAdmin = (req, res, next) => {
  if (req.session.username === "admybad") {
    next();
  } else {
    //Bien sur le code status
    res.status(403).send("Accès interdit");
  }
};

module.exports = checkIsAdmin;
