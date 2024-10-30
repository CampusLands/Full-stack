const router = require("express").Router({ mergeParams: true });
const limit = require("../limit/noteLimit");
const noteController = require("../controller/noteController")
const historyController = require("../controller/historyController")
const versionMiddleware = require("../middleware/versionate");
// Las rutas que preceden a otras rutas tienen prioridad.
// Las rutas con parámetros, seguidas por otra ruta, ocupan el segundo lugar.
// Las rutas con parámetros se ubican en tercer lugar.
// Las rutas sin parámetros se colocan en cuarto lugar.

/**
 * GET/ Note
 * ! Versiones 1.0.0
 */
router.get("/search", limit.get, versionMiddleware("1.0.0"), noteController.findNotesMatchingTitleOrDescription);

router.get("/:id/history", limit.get, versionMiddleware("1.0.0"), noteController.findNoteChangeHistory);

router.get("/:id", limit.get, versionMiddleware("1.0.0"), noteController.findNoteById);

router.get("/", limit.get, versionMiddleware("1.0.0"), noteController.findAllNotes);
/**
 * POST/ Note
 * ! Versiones 1.0.0
 */
router.post("/:id/history", limit.post, versionMiddleware("1.0.0"), historyController.updateHistoryNote);
router.post("/", limit.post, versionMiddleware("1.0.0"), noteController.save);
/**
 * PUT/ Note
 * ! Versiones 1.0.0
 */
router.put("/:id", limit.put, versionMiddleware("1.0.0"), noteController.updateNoteById);
/**
 * DELETE/ Note
 * ! Versiones 1.0.0
 */
router.delete("/:id", limit.delete, versionMiddleware("1.0.0"), noteController.deleteNoteById);

module.exports = router;