import { GuildMember, SlashCommandBuilder } from 'discord.js';

export const StartAucCommand: BotCommand = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('start-auc')
		.setDescription('Команда для старта аукциона'),
	async execute(interaction) {
        const member = interaction.member as GuildMember;
        const nickName = member.nickname || member.user.globalName;
        const auctionRoleName = 'аукцион';
        const hasAuctionRole = member.roles.cache.some(_role => _role.name.toLowerCase() === auctionRoleName);

        if (hasAuctionRole) {
		    await interaction.reply(`Пользователь ${nickName} начал аукцион!`);
        }
        
        await interaction.reply(`Пользователь ${nickName} не имеет роль ${auctionRoleName}, которая требуется для старта аукциона`)
	},
}
