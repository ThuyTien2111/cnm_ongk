const express=require("express")
const app=express()
const port=3004
const multer=require("multer")
const AWS=require("aws-sdk")
require("dotenv").config()
process.env.AWS_SDK_JS_SUPRESS_MAINTENANCE_MOD_MESSAGE="1"
AWS.config.update({
    region:process.env.REGION,
    accessKeyId:process.env.ACCESS_KEY_ID,
    secretAccessKey:process.env.ACCESS_SECRET_KEY
})
const dynamodb=new AWS.DynamoDB.DocumentClient()
const s3=new AWS.S3()
const tableName=process.env.TABLE_NAME
const bucketName=process.env.BUCKET_NAME

//1
app.use(express.urlencoded({extended:true}))
app.use(express.static("./views"))
app.set("view engine", "ejs")
app.set("views", "./views")

const storage=multer.memoryStorage({
    destination(req, file, cb){
        cb(null, "")
    }
})
const upload=multer({
    storage,
    limits:{fileSize: 20 * 1024 *1024}, //limit la mot doi tuong co thuoc tinh filesize
    fileFilter:function checkFile(req, file, cb){
        if(file.mimetype==='image/jpeg'||file.mimetype==='image/png'||file.mimetype==='image/webp'){
            cb(null, true)
        }else{
            cb(new Error("Tep phai co dang png jpg hoac webp"))
        }
    }
})
app.get("/", async(req, resp)=>{
    try{
        const params={TableName: tableName}
        const data=await dynamodb.scan(params).promise()
        return resp.render("index.ejs", {data:data.Items})
    }catch(err){
        return resp.status(500).send("LOI GET DU LIEU", err)
    }    
    
})
app.listen(port)