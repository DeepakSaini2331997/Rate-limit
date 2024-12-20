const dotenv = require("dotenv")

dotenv.config()

const RATELIMIT_DURATION_IN_SECOND = process.env.RATELIMIT_DURATION_IN_SECOND ||60
const NUMBER_OF_REQUEST_ALLOWED = process.env.NUMBER_OF_REQUEST_ALLOWED || 5
