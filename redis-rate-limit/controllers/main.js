const mainFun = (req,res)=>{
    res.status(200).json({success:true,msg:"index page"})
}

const pingPongFun = (req,res)=>{
    res.status(200).json({success:true,msg:"pong"})
}

module.exports= {
    mainFun,
    pingPongFun
}