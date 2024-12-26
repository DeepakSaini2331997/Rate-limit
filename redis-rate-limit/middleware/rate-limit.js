const Redis = require("ioredis")
const moment = require("moment")
const { REDIS_HOST,REDIS_PASSWORD,REDIS_PORT,NUMBER_OF_REQUEST_ALLOWED,RATELIMIT_DURATION_IN_SECOND} = require('../config/env.js')
//const redisClient = new Redis({url:"redis://localhost:6379"})
//console.log(REDIS_HOST+'----'+REDIS_PORT+'-----'+REDIS_PASSWORD+'---'+NUMBER_OF_REQUEST_ALLOWED)

const redisClient = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD
});

redisClient.on("connect",(err)=>{
    if(err){
        console.log('Redis Connect Error '+err)

    }
    console.log('Redis Connect Successfully')
})

const rateLimiter = async (req,res,next) =>{
    try{
        const userId = req.headers["userid"] // insted for this we use ip address
        //console.log(req.headers," my userid"+userId)

        if(!userId){
            return res.status(500).json({
                success:false,
                msg:'Token required!'
            })
        }
        const currentTime = moment().unix()
        const checkUserIdExit = await redisClient.hgetall(userId)
        //console.log(checkUserIdExit," check user exist")

        if(Object.keys(checkUserIdExit).length === 0 ){
            const result = await redisClient.hset(userId,{
                "createdAt":currentTime,
                "count":1
            })
            //console.log(result," save result2")
            return next()
        }else{
            const diff = currentTime - checkUserIdExit["createdAt"] 
            console.log(diff, " its difference")
            if(diff>RATELIMIT_DURATION_IN_SECOND){
                const result = await redisClient.hset(userId,{
                    "createdAt":currentTime,
                    "count":1
                })
                //console.log(result," save result3")
                return next()
            }

            if(checkUserIdExit["count"]>=NUMBER_OF_REQUEST_ALLOWED){
                return res.status(429).json({
                    success:false,
                    msg:"user-ratelimit exit"+NUMBER_OF_REQUEST_ALLOWED
                })
            }else{
                const result = await redisClient.hset(userId,{
                    "count":parseInt(checkUserIdExit["count"])+parseInt(1)
                })
                //console.log(result," save result4 ",checkUserIdExit["count"])
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