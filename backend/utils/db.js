import mongoose from "mongoose";

const connect = async () => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DB_URI).then(() => {
        console.log("connected to database")
    }).catch(e=>console.log(e))
}

export default connect;