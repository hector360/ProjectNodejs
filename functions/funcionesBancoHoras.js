const BancoHoras = require("../database/models/BancoHoras");

async function crearBancoHoras(data) {
  return await BancoHoras.create({
    id_user: data.id_user,
    total_horas: data.total_horas,
    horas_restantes: data.horas_restantes,
    sku_membresia: data.sku_membresia,
    horas_extra: data.horas_extra,
  })
    .then((banco_horas) => {
      return banco_horas;
    })
    .catch((error) => {
      console.log(error);
    });
}
async function actualizarBancoHoras(data) {
  return await BancoHoras.update(
    {
      horas_extra: data.horas,
    },
    {
      where: {
        id: data.id_bancoHoras,
      },
    }
  )
    .then((horasBanco) => horasBanco)
    .catch((error) => {
      console.log(error);
    });
}
async function getBancoHoras(sku_membresia) {
  return await BancoHoras.findOne({
    where: {
      sku_membresia: sku_membresia,
    },
  })
    .then((banco_horas) => {
      return banco_horas;
    })
    .catch((error) => {
      console.log(error);
    });
}
async function restarHorasP(horas_restantes, sku_membresia) {
  return await BancoHoras.update(
    {
      horas_restantes: horas_restantes,
    },
    {
      where: {
        sku_membresia: sku_membresia,
      },
    }
  ).then((horasRestadas) => {
    return horasRestadas;
  });
}

async function agregarDeuda(deuda_horas, id_banco) {
  return BancoHoras.findOne({
    where: {
      id: id_banco,
    },
  }).then(async (bancoHoras) => {
    console.log("esto es la deuda que se agregara: ", deuda_horas);
    if (bancoHoras != null) {
      deuda_horas = bancoHoras.deuda_horas + deuda_horas;
      return await BancoHoras.update(
        {
          deuda_horas: deuda_horas,
        },
        {
          where: {
            id: bancoHoras.id,
          },
        }
      ).then((bancoActualizado) => {
        return bancoActualizado;
      });
    } else {
      console.log("no se encontro el banco , hay un error");
    }
  });
}
async function actualizarDeuda(deuda_horas, sku_membresia) {
  return await BancoHoras.update(
    {
      deuda_horas: deuda_horas,
    },
    {
      where: {
        sku_membresia: sku_membresia,
      },
    }
  ).then((bancoActualizado) => {
    return bancoActualizado;
  });
}
async function restarHorasRestantes(horas_restantes, id_banco) {
  return BancoHoras.update(
    {
      horas_restantes: horas_restantes,
    },
    {
      where: {
        id: id_banco,
      },
    }
  ).then((bancoHoras) => {
    return bancoHoras;
  });
}
async function restarHorasRestantesFromSku(horas_restantes, sku_membresia) {
  return BancoHoras.update(
    {
      horas_restantes: horas_restantes,
    },
    {
      where: {
        sku_membresia: sku_membresia,
      },
    }
  ).then((bancoHoras) => {
    return bancoHoras;
  });
}

async function restarHorasExtra(deuda_horas, id_banco) {
  return BancoHoras.update(
    {
      horas_extra: deuda_horas,
    },
    {
      where: {
        id: id_banco,
      },
    }
  ).then((bancoHoras) => {
    return bancoHoras;
  });
}
async function renovarMembresia(horas_restantes, sku_membresia) {
  return BancoHoras.update(
    {
      horas_restantes: horas_restantes,
    },
    {
      where: {
        sku_membresia: sku_membresia,
      },
    }
  ).then((bancoHoras) => {
    return bancoHoras;
  });
}

module.exports = {
  crearBancoHoras,
  getBancoHoras,
  restarHorasP,
  agregarDeuda,
  restarHorasExtra,
  restarHorasRestantes,
  restarHorasRestantesFromSku,
  actualizarBancoHoras,
  actualizarDeuda,
  renovarMembresia,
};
