const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const { blogmodel } = require("./models/blog")
const bcrypt = require("bcryptjs")
const jwt=require("jsonwebtoken")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://hari:hari001@cluster0.ocavfn3.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0")


const generateHashedPassword = async (password) => {                  //to make password hashed, async for asynchronous function a time taking procces
    const salt = await bcrypt.genSalt(10)                           //salt is cost factor range is 4 to 31,genSalt is a function
    return bcrypt.hash(password, salt)                               //asynchronous evide varumbolum await use cheyyanam
}

app.post("/signup", async (req, res) => {                            //async fn call cheyyan mattoru async fn venam
    let input = req.body
    let hashedPassord = await generateHashedPassword(input.pass)
    // console.log(hashedPassord)
    input.pass = hashedPassord
    let blog = new blogmodel(input)
    blog.save()
    res.json({ "status": "success" })

})

app.post("/signin", (req, res) => {                        //passsword is encrypted but we input plaintext we use compare fn in bcrypt to compare with db password and input password.if true success,else failed
    let input = req.body                                                   //3 cases 1 no user exist,2 password incorrect,3 both correct.For third case if success status succes then pass id
    blogmodel.find({ "email": req.body.email }).then(                      //we pass email inside find
        (response) => {
            //console.log(response)
            if (response.length > 0) {                     //checking the case email thhettannkil empty arrayy aanu vara.appol email length nammal greater 0 aano nnu nokkum.appol greater 0 anel succes allenkil error
                let dbPassword = response[0].pass
                //console.log(dbPassword)
                bcrypt.compare(input.pass, dbPassword, (error, isMatch) => {      //compare fn il dbpwd and nammude pwd kodukkanam ie aadhyam nammude pwd pine dbpwd pine oru arrow function
                    if (isMatch) {                                                  //match aanel token generate cheyyanam
                        jwt.sign({email:input.email},"blog-app",{expiresIn:"1d"}, //first email is keyword blogapp is any name
                    (error,token)=>{
                        if (error) {
                            res.json({"status":"Unable to create token"})
                            
                        } else {
                            res.json({ "status": "success" ,"userId":response[0]._id,"token":token}) 
                            
                        }
                    })                                                           //step by step chyumbol adhyam id pass cheyathe nokknam.appol pwd correct koduthal status success ennum thetti koduthal error ennum postmanil kaanikkanam.ennit _id pass cheynam ennit veendum post man nokknam.appol _id userid enna peril varanam
                } else {
                    res.json({ "status": "error" })
                }
            })
} else {
    res.json({ "status": "user not found" })
}
        }
).catch()               
})




app.listen(8081, () => {
    console.log("started")
})