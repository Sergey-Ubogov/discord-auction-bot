import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonComponent,
    ButtonInteraction,
    ButtonStyle,
} from 'discord.js';
import { getBidFromString } from './get-bid-from-string.js';
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
                if (buttonComponent.customId === 'stop-auc-button') {
                    return newButton;
                }

                if (
                    (i.component as ButtonComponent).customId ==
                    buttonComponent.customId
                ) {
                    const oldBid = getBidFromString(newButton.data.label);
                    const newBid = oldBid + bidStep;
                    const newNickName = getNickName(i);

                    newButton.setLabel(`${formatBid(newBid)} ${newNickName}`);
                    newButton.setStyle(ButtonStyle.Success);
                }
                return newButton;
            })
        );
        return updatedActionRow;
    });
}
