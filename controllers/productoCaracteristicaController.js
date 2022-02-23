const ProductoCaracteristicaRepository = require("../repository/productoCaracteristicas");

const boom = require("@hapi/boom");

exports.create = async (req, res, next) => {
  try {
    const pc = await ProductoCaracteristicaRepository.createRepository(
      req.body
    );

    if (pc.isBoom) next(pc);

    res.status(200).json({
        status: res.statusCode,
        message: {
          label: "Producto dado de alta",
          producto: pc,
        },
      });
  } catch (err) {
    next(boom.badData(err));
  }
};

exports.get = async (req, res, next) => {
  try {
    const pc = await ProductoCaracteristicaRepository.get();

    if (pc.isBoom) next(pc);

    res.status(200).json({
        status: res.statusCode,
        message: {
          label: "Listado de Productos",
          producto: pc,
        },
      });
  } catch (err) {
    next(boom.badData(err));
  }
};
