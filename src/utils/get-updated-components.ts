import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonComponent,
    ButtonInteraction,
    ButtonStyle,
} from 'discord.js';
import { getBidAndNickNameFromString } from './get-bid-from-string.js';
import { formatBid } from './format-bid.js';
import { getNickName } from './get-nick-name.js';

export function getUpdatedComponents<T extends ButtonComponent>(
    i: ButtonInteraction,
    bidStep: number
) {
    return i.message.components.map((oldActionRow) => {
        const updatedActionRow = new ActionRowBuilder<ButtonBuilder>();

        updatedActionRow.addComponents(
            oldActionRow.components.map((buttonComponent: ButtonComponent) => {
                const newButton = ButtonBuilder.from(buttonComponent);
                if (!buttonComponent.customId.startsWith('lot-number')) {
                    return newButton;
                }

                if (
                    (i.component as ButtonComponent).customId ==
                    buttonComponent.customId
                ) {
                    const { bid: oldBid, nickName: oldNickName } =
                        getBidAndNickNameFromString(newButton.data.label);
                    const newNickName = getNickName(i);
                    const newBid = oldNickName ? oldBid + bidStep : oldBid;

                    newButton.setLabel(`${formatBid(newBid)} ${newNickName}`);
                    newButton.setStyle(ButtonStyle.Primary);
                }
                return newButton;
            })
        );
        return updatedActionRow;
    });
}
