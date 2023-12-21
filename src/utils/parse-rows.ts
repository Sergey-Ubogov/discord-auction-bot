import {
    APIButtonComponentWithCustomId,
    ActionRowBuilder,
    ButtonBuilder,
} from 'discord.js';
import { getBidAndNickNameFromString } from './get-bid-from-string.js';
import { formatBid } from './format-bid.js';

export function parseRows(
    rows: ActionRowBuilder<ButtonBuilder>[],
    interaction: ChatInputCommandInteraction
) {
    return rows
        .flatMap((actionRow) => {
            return actionRow.components
                .filter((buttonBuilder: ButtonBuilder) => {
                    return (
                        buttonBuilder.data as APIButtonComponentWithCustomId
                    ).custom_id.startsWith('lot-number');
                })
                .map((buttonBuilder: ButtonBuilder) => {
                    return getBidAndNickNameFromString(
                        buttonBuilder.data.label
                    );
                });
        })
        .sort((data1, data2) => {
            if (data2.bid === data1.bid) {
                return data2.nickName?.localeCompare(data1.nickName);
            }
            return data2.bid - data1.bid;
        })
        .map((data, index) => {
            const user = interaction.guild.members.cache.find((member) => {
                return [member.nickname, member.user.globalName].includes(
                    data.nickName
                );
            });
            const rightPart = data.nickName
                ? `${user?.toString() || data.nickName}`
                : '— никто не сделал ставку.';
            return `${index + 1}. ${formatBid(data.bid)} ${rightPart}`;
        })
        .join('\n');
}
