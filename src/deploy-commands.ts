import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { AllCommands } from './commands/index.js';

dotenv.config();

const {
    DISCORD_TOKEN: token,
    APPLICATION_ID: clientId,
    GUILD_ID: guildId,
} = process.env;

deployCommands();

async function deployCommands() {
    const commands = AllCommands;

    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(token);

    // and deploy your commands!
    try {
        console.log(
            `Started refreshing ${commands.length} application (/) commands.`
        );

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = (await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        )) as { length: number };

        console.log(
            `Successfully reloaded ${data.length} application (/) commands.`
        );
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
}
