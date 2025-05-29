const express = require("express");
const {
  summaryController,
  paragraphController,
  chatbotController,
  codeconverterController,
} = require("../controllers/huggingControllers");
const { generateImage } = require("../controllers/imageAIController");

const router = express.Router();


router.post("/summary", summaryController);
router.post("/paragraph", paragraphController);
router.post("/chatbot", chatbotController);
router.post("/codeconverter", codeconverterController);
router.post("/generate-image", generateImage); 

module.exports = router;







