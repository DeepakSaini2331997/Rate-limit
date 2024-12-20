const express = require("express")
const router = require("./routes/main")
const app = express()

const port = process.env.PORT || 3000

//routes
app.use(router)

app.listen(port,()=>{
    console.log("Connect on port"+port)
})