import {
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    GuildMember,
    SlashCommandBuilder,
} from 'discord.js';
import { formatBid } from '../../utils/format-bid.js';
import { getRows } from '../../utils/get-rows.js';
import { getUpdatedComponents } from '../../utils/get-updated-components.js';
import { getNickName } from '../../utils/get-nick-name.js';
import { formatTime } from '../../utils/format-time.js';

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
                .setMaxValue(25)
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
        .addNumberOption((option) =>
            option
                .setName('time')
                .setDescription(
                    'Время аукциона (в минутах, 12ч = 720мин, 24ч = 1440мин)'
                )
                .setMinValue(1)
                .setRequired(true)
        )
        .setDescription('Команда для старта аукциона'),
    async execute(interaction) {
        const member = interaction.member as GuildMember;
        const nickName = getNickName(interaction);
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
        const startBid = interaction.options.getNumber('start_bid', true);
        const bidStep = interaction.options.getNumber('bid_step', true);
        const time = interaction.options.getNumber('time', true);

        const buttons = [...new Array(countLots)].map((_, index) =>
            new ButtonBuilder()
                .setCustomId(`lot-number-${index + 1}`)
                .setLabel(formatBid(startBid))
                .setStyle(ButtonStyle.Primary)
        );

        const rows = getRows(buttons);

        const response = await interaction.reply({
            content: `Пользователь ${nickName} начал аукцион «${aucName}»!
Количество лотов: ${countLots}.
Стартовая ставка на лот: ${formatBid(startBid)}.
Шаг ставки: ${formatBid(bidStep)}.
Время проведения аукциона: ${formatTime(time)}.
`,
            components: rows,
        });

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: time * 60 * 1000,
        });

        collector.on('collect', async (i) => {
            i.update({
                components: getUpdatedComponents(i, bidStep),
            });
        });

        collector.on('end', (collected) => {
            console.info(collected);
            interaction.followUp(`Аукцион «${aucName}» завершен!`);
        });
    },
};
