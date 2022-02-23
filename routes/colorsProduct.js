const ColorController = require("../controllers/colorsController");

exports.colorsRoutes = (router) => {
  router.post("/color_product", (req, res, next) => {
    ColorController.create(req, res, next);
  });

  router.get("/color_product", (req, res, next) => {
    ColorController.get(req, res, next);
  });
};
