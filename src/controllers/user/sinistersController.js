const { Car, Sinister } = require("../../models/index");
const moment = require("moment");

const controller = {};

controller.index = async (req, res) => {
  const sinisters = await Sinister.findByUser(req.user.id);
  console.log(sinisters);
  res.render("user/sinisters/index.html", {
    title: "Listado de siniestros",
    file: "user.sinisters",
    sinisters,
  });
};

controller.create = async (req, res) => {
  const car_id = req.params.car_id;
  const car = await Car.findById(car_id);
  res.render("user/sinisters/create.html", {
    title: "Registrar siniestro",
    file: "user.cars",
    car,
    dateNow: moment(Date.now()).format("YYYY-MM-DD"),
  });
};

controller.store = async (req, res) => {
  const car_id = req.params.car_id;
  const { description, date } = req.body;
  const errors = [];

  if (description.length === 0) {
    errors.push({ text: "La descripcion es requerida" });
  }

  if (date.length === 0) {
    errors.push({ text: "La fecha es requerida" });
  }

  if (errors.length > 0) {
    req.flash("errors", errors);
    req.flash("data", { description, date });
    return res.redirect(`/user/sinisters/${car_id}/create`);
  }

  const sinister = { car_id, description, date };
  await Sinister.create(sinister);

  const car = await Car.findById(car_id);
  await Car.update(car.id, { state: 3 });
  req.flash(
    "success",
    "Siniestro registrado, ahora debes esperar la aceptacion de este"
  );
  res.redirect(`/user/cars`);
};

controller.show = async (req, res) => {
  const sinister_id = req.params.sinister_id;
  const detail = await Sinister.findDetail(sinister_id);
  console.log(detail);
  res.render("user/sinisters/view.html", {
    title: "Detalles siniestro",
    file: "user.sinisters",
    detail,
  });
};

module.exports = controller;
