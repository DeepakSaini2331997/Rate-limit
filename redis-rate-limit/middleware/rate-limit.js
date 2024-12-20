const Redis = require("ioredis")
const moment = require("moment")
require('../config/env')
const redisClient = new Redis({url:"redis://localhost:6379"})

const rateLimiter = async (req,res,next) =>{
    try{
        const userId = req.headers["userId"] // insted for this we use ip address
        const currentTime = moment().unix()
        const checkUserIdExit = await redisClient.hgetall(userId)
        if(!checkUserIdExit){
            await redisClient.hset(userId,{
                "createdAt":currentTime,
                "count":1
            })
            return next()
        }else{
            const diff = currentTime - checkUserIdExit["createdAt"] 
            if(diff>RATELIMIT_DURATION_IN_SECOND){
                await redisClient.hset(userId,{
                    "createdAt":currentTime,
                    "count":1
                })
                return next()
            }

            if(checkUserIdExit["count"]>=NUMBER_OF_REQUEST_ALLOWED){
                return res.status(429).json({
                    success:false,
                    msg:"user-ratelimit exit"+NUMBER_OF_REQUEST_ALLOWED
                })
            }else{
                await redisClient.hset(userId,{
                    "count":parseInt(checkUserIdExit["count"]+1)
                })
                return next()
            }
        }

    }catch(error){
        return res.status(500).json({
            success:false,
            msg:'Some Error Occur '+error
        })
    }
    

}

module.exports = {
    rateLimiter
}