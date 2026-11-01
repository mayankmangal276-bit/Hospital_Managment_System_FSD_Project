import app from "./app.js";
import cloudinary from "cloudinary"
import { config } from "dotenv";

config({ path: "./config.env" });
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.listen(process.env.PORT || 4000, ()=>{
    console.log(`Server listening on port ${process.env.PORT || 4000}`);
});