const express = require("express");
const router = express.Router();

const {
  home,
  auth,
  admin,
  callcenter,
  mechanic,
  user,
} = require("../controllers/index");

const {
  isAuthenticated,
  isAdmin,
  isCallcenter,
  isMechanic,
  isUser,
  isNotAuthenticated,
} = require("../middlewares/auth");

module.exports = (app) => {
  router.get("/", home.index);
  router.get("/login", [isNotAuthenticated], auth.showLogin);
  router.post("/login", auth.login);
  router.post("/logout", auth.logout);

  router.get("/admin", [isAuthenticated, isAdmin], admin.pages.index);
  router.get("/admin/users", [isAuthenticated, isAdmin], admin.users.index);
  router.get(
    "/admin/users/create",
    [isAuthenticated, isAdmin],
    admin.users.create
  );
  router.post("/admin/users", [isAuthenticated, isAdmin], admin.users.store);
  router.get("/admin/users/:id", [isAuthenticated, isAdmin], admin.users.show);
  router.get(
    "/admin/users/:id/edit",
    [isAuthenticated, isAdmin],
    admin.users.edit
  );
  router.put(
    "/admin/users/:id",
    [isAuthenticated, isAdmin],
    admin.users.update
  );
  router.delete(
    "/admin/users/:id",
    [isAuthenticated, isAdmin],
    admin.users.destroy
  );

  router.get(
    "/callcenter",
    [isAuthenticated, isCallcenter],
    callcenter.pages.index
  );
  router.get(
    "/callcenter/users",
    [isAuthenticated, isCallcenter],
    callcenter.users.index
  );
  router.get(
    "/callcenter/users/create",
    [isAuthenticated, isCallcenter],
    callcenter.users.create
  );
  router.post(
    "/callcenter/users",
    [isAuthenticated, isCallcenter],
    callcenter.users.store
  );
  router.get(
    "/callcenter/users/:id",
    [isAuthenticated, isCallcenter],
    callcenter.users.show
  );
  router.get(
    "/callcenter/users/:id/edit",
    [isAuthenticated, isCallcenter],
    callcenter.users.edit
  );
  router.put(
    "/callcenter/users/:id",
    [isAuthenticated, isCallcenter],
    callcenter.users.update
  );
  router.delete(
    "/callcenter/users/:id",
    [isAuthenticated, isCallcenter],
    callcenter.users.destroy
  );

  router.get(
    "/callcenter/cars",
    [isAuthenticated, isCallcenter],
    callcenter.cars.users
  );
  router.get(
    "/callcenter/cars/:user_id",
    [isAuthenticated, isCallcenter],
    callcenter.cars.index
  );
  router.get(
    "/callcenter/cars/:user_id/create",
    [isAuthenticated, isCallcenter],
    callcenter.cars.create
  );
  router.post(
    "/callcenter/cars/:user_id",
    [isAuthenticated, isCallcenter],
    callcenter.cars.store
  );
  router.get(
    "/callcenter/cars/:user_id/:car_id",
    [isAuthenticated, isCallcenter],
    callcenter.cars.show
  );
  router.get(
    "/callcenter/cars/:user_id/:car_id/edit",
    [isAuthenticated, isCallcenter],
    callcenter.cars.edit
  );
  router.put(
    "/callcenter/cars/:user_id/:car_id",
    [isAuthenticated, isCallcenter],
    callcenter.cars.update
  );
  router.delete(
    "/callcenter/cars/:user_id/:car_id",
    [isAuthenticated, isCallcenter],
    callcenter.cars.destroy
  );

  router.get(
    "/callcenter/sinisters/withdraw",
    [isAuthenticated, isCallcenter],
    callcenter.sinisters.withdraw
  );
  router.put(
    "/callcenter/sinisters/:sinister_id/finalized",
    [isAuthenticated, isCallcenter],
    callcenter.sinisters.finalized
  );
  router.get(
    "/callcenter/sinisters/:car_id",
    [isAuthenticated, isCallcenter],
    callcenter.sinisters.create
  );
  router.post(
    "/callcenter/sinisters/:car_id",
    [isAuthenticated, isCallcenter],
    callcenter.sinisters.store
  );

  // router.get("/mechanic", [isAuthenticated, isMechanic], mechanic.pages.index);
  router.get(
    "/mechanic/sinisters/pending",
    [isAuthenticated, isMechanic],
    mechanic.sinisters.pending
  );
  router.get(
    "/mechanic/sinisters/:sinister_id/pending",
    [isAuthenticated, isMechanic],
    mechanic.sinisters.showPending
  );
  router.put(
    "/mechanic/sinisters/:sinister_id/pending",
    [isAuthenticated, isMechanic],
    mechanic.sinisters.updatePending
  );
  router.get(
    "/mechanic/sinisters/acepted",
    [isAuthenticated, isMechanic],
    mechanic.sinisters.acepted
  );
  router.put(
    "/mechanic/sinisters/:sinister_id/acepted",
    [isAuthenticated, isMechanic],
    mechanic.sinisters.updateAcepted
  );
  router.get(
    "/mechanic/sinisters/in-process",
    [isAuthenticated, isMechanic],
    mechanic.sinisters.inProcess
  );
  router.get(
    "/mechanic/sinisters/in-process/:sinister_id/edit",
    [isAuthenticated, isMechanic],
    mechanic.sinisters.inProcessEdit
  );
  router.put(
    "/mechanic/sinisters/:sinister_id/in-process",
    [isAuthenticated, isMechanic],
    mechanic.sinisters.updateInProcess
  );
  router.put(
    "/mechanic/sinisters/:sinister_id/deleted",
    [isAuthenticated, isMechanic],
    mechanic.sinisters.updateDeleted
  );

  // router.get("/user", [isAuthenticated, isUser], user.pages.index);
  router.get("/user/cars", [isAuthenticated, isUser], user.cars.index);
  router.get(
    "/user/sinisters",
    [isAuthenticated, isUser],
    user.sinisters.index
  );
  router.get(
    "/user/sinisters/:car_id/create",
    [isAuthenticated, isUser],
    user.sinisters.create
  );
  router.post(
    "/user/sinisters/:car_id",
    [isAuthenticated, isUser],
    user.sinisters.store
  );
  router.get(
    "/user/sinisters/:sinister_id/view",
    [isAuthenticated, isUser],
    user.sinisters.show
  );

  app.use(router);
};
