type ChatInputCommandInteraction =
    import('discord.js').ChatInputCommandInteraction;
type InteractionResponse = import('discord.js').InteractionResponse;

declare type BotCommand = {
    category: 'utility';
    data: import('discord.js').SlashCommandBuilder;
    execute(
        interaction: ChatInputCommandInteraction
    ): Promise<InteractionResponse | void>;
};
