const express=require("express")
const app=express();
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const authroutes=require("./routes/auth")
const userRoute = require("./routes/users");
const deviceRoute = require("./routes/devices");


dotenv.config();



app.listen(process.env.PORT,()=>{
    console.log("app Running")
});


mongoose.connect(process.env.MONGO_URL, 
{useNewUrlParser: true,
useUnifiedTopology:true,
useCreateIndex: true,
useFindAndModify:false
}).then(()=>{
    console.log("Db Connection is Ready")
}).catch(err=>{
    console.log("error in the Connection")
})


app.use(express.json())

app.use("/api/auth",authroutes)
app.use("/api/user",userRoute)
app.use("/api/device",deviceRoute)
