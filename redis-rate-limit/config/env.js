
const dotenv = require("dotenv")

dotenv.config()

const RATELIMIT_DURATION_IN_SECOND = process.env.RATELIMIT_DURATION_IN_SECOND ||60
const NUMBER_OF_REQUEST_ALLOWED = process.env.NUMBER_OF_REQUEST_ALLOWED || 5
const REDIS_HOST = process.env.REDIS_HOST
const REDIS_PORT = process.env.REDIS_PORT
const REDIS_PASSWORD = process.env.REDIS_PASSWORD

module.exports = {
    RATELIMIT_DURATION_IN_SECOND,
    NUMBER_OF_REQUEST_ALLOWED,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD
}