const express = require("express");
const router = express.Router();
const opdController = require("../controllers/opdController");

router.get("/", opdController.getAllOPDVisits);
router.get("/opd", opdController.getOPDVisits);
router.post("/opd", opdController.createOPDVisit);
router.put("/opd/:id", opdController.updateOPDVisit);
router.delete("/opd/:id", opdController.deleteOPDVisit);

module.exports = router;
