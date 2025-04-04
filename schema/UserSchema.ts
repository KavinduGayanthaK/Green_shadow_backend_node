import mongoose, { Schema, Document } from "mongoose";



export interface IUser extends Document {
  username:string ;
  password:string;
  
}

const user = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},

 
});

const User = mongoose.model<any>("User", user);
export default User;
