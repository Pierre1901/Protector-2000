import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import { client } from "./client";
import messageReactionAdd from "./events/messageReactionAdd";
import messageReactionRemove from "./events/messageReactionRemove";
import { startApiServer } from "./api/server";

client.on("messageReactionAdd", messageReactionAdd);
client.on("messageReactionRemove", messageReactionRemove);

client.once("ready", async () => {
    console.log(`🤖 Bot connecté en tant que ${client.user?.tag}`);
    startApiServer();
});

client.login(process.env.TOKEN);