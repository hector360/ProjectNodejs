const productoCaracteristicaController = require("../controllers/productoCaracteristicaController");

exports.getRoutes = (router) => {
    router.post("/producto_caracteristica", (req, res, next) => {
        productoCaracteristicaController.create(req, res, next);
    });

    router.get("/producto_caracteristica", (req, res, next) => {
        productoCaracteristicaController.get(req, res, next);
    });

    
}