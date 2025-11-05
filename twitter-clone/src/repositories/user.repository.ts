import { IUser } from "../interfaces/user.interface";
import { UserModel } from "../models/user.model";

export class UserRepository {
    async createUser(userData: Partial<IUser>): Promise<IUser> {
        const user = new UserModel(userData);
        return await user.save();
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email });
    }

    async findUserById(id: string): Promise<IUser | null> {
        return await UserModel.findById(id);
    }
}