import { GuildMember, SlashCommandBuilder } from 'discord.js';
import { getNickName } from '../../utils/get-nick-name.js';

export const StopAucCommand: BotCommand = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('stop-auc')
        .setDescription('Команда для завершения аукциона'),
    async execute(interaction) {
        const member = interaction.member as GuildMember;
        const nickName = getNickName(interaction);
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
