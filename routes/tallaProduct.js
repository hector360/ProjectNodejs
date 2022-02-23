const TallaController = require("../controllers/tallaController");

exports.getRoutes = (router) => {
    router.post("/talla", (req, res, next) => {
        TallaController.createTalla(req, res, next);
    });

    router.get("/talla", (req, res, next) => {
        TallaController.getTallas(req, res, next);
    });
}