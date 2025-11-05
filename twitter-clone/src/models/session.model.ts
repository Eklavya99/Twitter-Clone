import mongoose, {Schema} from "mongoose";
import { ISession } from "../interfaces/session.interface";

const sessionSchema: Schema = new Schema({
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    refreshToken: { type: String, required: true },
    userAgent: { type: String, required: true }, // Browser or client info
    ipAddress: { type: String, required: true }, // IP address of the client
    expiresAt: { type: Date, required: true },
    isRevoked: { type: Boolean, default: false },
}, {
    timestamps: true
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const sessionModel = mongoose.model<ISession>('Session', sessionSchema);