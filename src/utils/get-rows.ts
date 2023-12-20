import { ActionRowBuilder, AnyComponentBuilder } from 'discord.js';

export function getRows<T extends AnyComponentBuilder>(
    items: T[]
): ActionRowBuilder<T>[] {
    const rows: ActionRowBuilder<T>[] = [];

    items.forEach((item) => {
        if (!rows.length || rows[rows.length - 1].components.length >= 5) {
            rows.push(new ActionRowBuilder<T>());
        }

        rows[rows.length - 1].addComponents(item);
    });

    return rows;
}
