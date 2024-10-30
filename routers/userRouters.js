const router = require("express").Router();
const versionMiddleware = require("../middleware/versionate");
const userController = require("../controller/userController");
const limit = require("../limit/userLimit");
const validator = require("../validator/userValidator");
// Las rutas que preceden a otras rutas tienen prioridad.
// Las rutas con parámetros, seguidas por otra ruta, ocupan el segundo lugar.
// Las rutas con parámetros se ubican en tercer lugar.
// Las rutas sin parámetros se colocan en cuarto lugar.

/**
 * POST/ Note
 * ! Versiones 1.0.0
 */

router.post("/login", limit.login, versionMiddleware("1.0.0"), userController.signInUser);
router.post("/logout", limit.post, versionMiddleware("1.0.0"), userController.logoutUser);
router.post("/", limit.post, versionMiddleware("1.0.0"), validator.addNewUser, userController.addNewUser);
/**
 * PUT/ Note
 * ! Versiones 1.0.0
 */
router.put("/:id", limit.put, versionMiddleware("1.0.0"), userController.updateUserById);
/**
 * DELETE/ Note
 * ! Versiones 1.0.0
 */
router.delete("/:id", limit.delete, versionMiddleware("1.0.0"), userController.deleteUserById);
module.exports = router;