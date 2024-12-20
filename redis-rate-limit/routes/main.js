const express = require("express")
const { mainFun, pingPongFun } = require("../controllers/main")
const { rateLimiter } = require("../middleware/rate-limit")
const router = express.Router()
router.get('/',mainFun)
router.get('/ping',rateLimiter,pingPongFun)

module.exports = router