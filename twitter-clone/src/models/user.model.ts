import mongoose, {Document, Schema} from "mongoose";
import { IUser } from "../interfaces/user.interface";

const userSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    }, {timestamps: true}
);

export const UserModel = mongoose.model<IUser & Document>("User", userSchema);