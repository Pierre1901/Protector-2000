import {
    MessageReaction,
    PartialMessageReaction,
    User,
    PartialUser
} from "discord.js";

export default async function messageReactionAdd(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
) {
    try {
        if (reaction.message.channelId !== process.env.RULE_CHANNEL_ID) {
            return;
        }
        if (reaction.partial) {
            await reaction.fetch();
        }
        if (user.partial) {
            user = await user.fetch();
        }
        if (reaction.message.id !== process.env.RULES_MESSAGE_ID) {
            console.log("❌ Mauvais message ID");
            return;
        }

        if (user.bot) {
            return;
        }

        if (reaction.emoji.name !== "✅") {
            return;
        }

        const guild = reaction.message.guild;
        if (!guild) {
            return;
        }
        const member = await guild.members.fetch(user.id);

        if (member.roles.cache.has(process.env.VIEWER_ROLE_ID!)) {
            return;
        }
        await member.roles.add(process.env.VIEWER_ROLE_ID!);
        console.log(`✅ Rôle Viewer donné à ${user.username}`);

    } catch (error) {
        console.error("❌ ERREUR:", error);
    }
}