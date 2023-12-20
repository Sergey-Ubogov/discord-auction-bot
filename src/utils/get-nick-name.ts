import { BaseInteraction, GuildMember } from 'discord.js';

export function getNickName<T extends BaseInteraction>(interaction: T) {
    const member = interaction.member as GuildMember;
    return member.nickname || member.user.globalName;
}
