import { GuildMember, SlashCommandBuilder } from 'discord.js';

export const StartAucCommand: BotCommand = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('start-auc')
        .addStringOption((option) =>
            option
                .setName('auc_name')
                .setDescription('Имя аукциона')
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('count_lots')
                .setDescription('Количество лотов для разыгрывания')
                .setRequired(true)
        )
        .setDescription('Команда для старта аукциона'),
    async execute(interaction) {
        const member = interaction.member as GuildMember;
        const nickName = member.nickname || member.user.globalName;
        const auctionRoleName = 'аукцион';
        const hasAuctionRole = member.roles.cache.some(
            (_role) => _role.name.toLowerCase() === auctionRoleName
        );

        if (!hasAuctionRole) {
            await interaction.reply(
                `Пользователь ${nickName} не имеет роль ${auctionRoleName}, которая требуется для старта аукциона`
            );
            return;
        }

        const aucName = interaction.options.getString('auc_name', true);
        const countLots = interaction.options.getNumber('count_lots', true);

        await interaction.reply(
            `Пользователь ${nickName} начал аукцион с названием «${aucName}»! Количество лотов: ${countLots}`
        );
    },
};
