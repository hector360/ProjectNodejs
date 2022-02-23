const BeneficiosController = require("../controllers/beneficiosController");

exports.getRoutes = (router) => {
  router.get("/get-benefits/:membresia", (req, res, next) => {
    BeneficiosController.getBenefits(req, res, next);
  });

  router.post("/set-benefit", (req, res, next) => {
    BeneficiosController.setBenefitsService(req, res, next);
  });
};