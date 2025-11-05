import { ObjectId } from "mongodb";
import { Document } from "mongoose";

export interface IUser extends Document {
    _id : ObjectId;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}