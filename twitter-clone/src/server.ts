import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectToDB } from "./config/dbConnection";

const PORT = Number(process.env.PORT) || 5000;

async function main() {
    await connectToDB(process.env.MONGO_URI || "");
    app.listen(PORT, () => console.log(`API listening on port: ${PORT}`));
}

main().catch((err) => {
    console.error("Server failed to start:", err);
    process.exit(1);
})