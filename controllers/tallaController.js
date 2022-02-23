const TallaRepository = require("../repository/tallaProductRepository");
const boom = require("@hapi/boom");

exports.createTalla = async (req, res, next) => {
  try {
    const talla = await TallaRepository.create({ data: req.body });

    if (talla.isBoom) next(talla);

    res.status(200).json({
      status: res.statusCode,
      message: {
        label: "Talla creada correctamente",
        talla,
      },
    });
  } catch (err) {
    next(boom.badData(err));
  }
};

exports.getTallas = async (req, res, next) => {
  try {
    const talla = await TallaRepository.get();

    if (talla.isBoom) next(talla);

    res.status(200).json({
      status: res.statusCode,
      message: {
        label: "Tallas Creadas",
        talla,
      },
    });
  } catch (err) {
    next(boom.badData(err));
  }
};
