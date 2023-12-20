export function getBidFromString(str: string) {
    const [strBid, nickName] = str.split(' ');

    if (strBid.endsWith('M')) {
        return parseInt(strBid) * 1000000;
    }

    if (strBid.endsWith('K')) {
        return parseInt(strBid) * 1000;
    }

    return parseInt(strBid);
}
