const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const {blogmodel}=require("./models/blog")
const bcrypt=require("bcryptjs")

const app=express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://hari:hari001@cluster0.ocavfn3.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0")


const generateHashedPassword=async(password)=>{                  //to make password hashed, async for asynchronous function a time taking procces
    const salt=await bcrypt.genSalt(10)                           //salt is cost factor range is 4 to 31,genSalt is a function
    return bcrypt.hash(password,salt)                               //asynchronous evide varumbolum await use cheyyanam
}

app.post("/signup",async(req,res)=>{                            //async fn call cheyyan mattoru async fn venam
    let input=req.body
    let hashedPassord=await generateHashedPassword(input.pass)
    // console.log(hashedPassord)
    input.pass=hashedPassord
    let blog=new blogmodel(input)
    blog.save()

    res.json({"status":"success"})
})

app.listen(8081,()=>{
    console.log("started")
})