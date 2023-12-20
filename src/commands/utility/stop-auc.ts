import { GuildMember, SlashCommandBuilder } from 'discord.js';

export const StopAucCommand: BotCommand = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('stop-auc')
        .setDescription('Команда для завершения аукциона'),
    async execute(interaction) {
        const member = interaction.member as GuildMember;
        const nickName = member.nickname || member.user.globalName;
        const auctionRoleName = 'аукцион';
        const hasAuctionRole = member.roles.cache.some(
            (_role) => _role.name.toLowerCase() === auctionRoleName
        );

        if (!hasAuctionRole) {
            await interaction.reply(
                `Пользователь ${nickName} не имеет роль ${auctionRoleName}, которая требуется для завершения аукциона`
            );
            return;
        }

        await interaction.reply(`Пользователь ${nickName} завершил аукцион!`);
    },
};
