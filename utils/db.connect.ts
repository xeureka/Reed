import mongoose from "mongoose";

async function connectdb(){
    try {
        await mongoose.connect(Bun.env.mongo_uri!)
        console.log('db connected ')
    } catch (error) {
        console.log('db connection error:- ',error)
    }
}
export default connectdb



