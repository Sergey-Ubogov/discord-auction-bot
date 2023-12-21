import {
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    GuildMember,
    Integration,
    SlashCommandBuilder,
} from 'discord.js';
import { formatBid } from '../../utils/format-bid.js';
import { getRows } from '../../utils/get-rows.js';
import { getUpdatedComponents } from '../../utils/get-updated-components.js';
import { getNickName } from '../../utils/get-nick-name.js';
import { formatTime } from '../../utils/format-time.js';
import { parseRows } from '../../utils/parse-rows.js';

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
                .setMinValue(1)
                .setMaxValue(24)
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('start_bid')
                .setDescription('Стартовая ставка на лот')
                .setMinValue(1000)
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('bid_step')
                .setDescription('Шаг ставки')
                .setMinValue(1000)
                .setRequired(true)
        )
        .setDescription('Команда для старта аукциона'),
    async execute(interaction) {
        await interaction.deferReply();
        const member = interaction.member as GuildMember;
        const userTag = member.user.toString();
        const auctionRoleName = 'аукцион';
        const hasAuctionRole = member.roles.cache.some(
            (_role) => _role.name.toLowerCase() === auctionRoleName
        );

        if (!hasAuctionRole) {
            await interaction.editReply(
                `Пользователь ${userTag} не имеет роль ${auctionRoleName}, которая требуется для старта аукциона`
            );
            return;
        }

        const aucName = interaction.options.getString('auc_name', true);
        const countLots = interaction.options.getNumber('count_lots', true);
        const startBid = interaction.options.getNumber('start_bid', true);
        const bidStep = interaction.options.getNumber('bid_step', true);

        const buttons = [...new Array(countLots)].map((_, index) =>
            new ButtonBuilder()
                .setCustomId(`lot-number-${index + 1}`)
                .setLabel(formatBid(startBid))
                .setStyle(ButtonStyle.Success)
        );
        buttons.push(
            new ButtonBuilder()
                .setCustomId('stop-auc-button')
                .setLabel('Завершить аукцион')
                .setStyle(ButtonStyle.Danger)
        );

        const rows = getRows(buttons);

        let components = rows;
        const response = await interaction.editReply({
            content: `Пользователь ${userTag} начал аукцион «${aucName}»!
Количество лотов: ${countLots}.
Стартовая ставка на лот: ${formatBid(startBid)}.
Шаг ставки: ${formatBid(bidStep)}.
`,
            components,
        });

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.Button,
        });

        collector.on('collect', async (i) => {
            if (i.customId === 'stop-auc-button') {
                const member = i.member as GuildMember;
                const userTag = member.user.toString();
                const hasAuctionRole = member.roles.cache.some(
                    (_role) => _role.name.toLowerCase() === auctionRoleName
                );

                await i.deferReply();
                if (hasAuctionRole) {
                    await i.editReply(`Аукцион «${aucName}» завершен пользователем ${userTag}!
Победители:
${parseRows(components, interaction)}
`);
                    collector.stop();
                } else {
                    await i.editReply(
                        `${userTag} попытался завершить аукцион, но у него нет для этого прав`
                    );
                }
            } else {
                await i.deferUpdate();
                components = getUpdatedComponents(i, bidStep);
                await i.editReply({
                    components,
                });
            }
        });
    },
};
