const mongoose=require("mongoose")
const schema=mongoose.Schema(
    {
        "name":String,
        "email":String,
        "pass":String
    }
)

let blogmodel=mongoose.model("users",schema)
module.exports={blogmodel}