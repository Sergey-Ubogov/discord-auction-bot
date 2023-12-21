export function getBidAndNickNameFromString(str: string) {
    const [strBid, nickName = ''] = str.split(' ');
    let bid: number;

    if (strBid.endsWith('M')) {
        bid = parseFloat(strBid) * 1000000;
    } else if (strBid.endsWith('K')) {
        bid = parseFloat(strBid) * 1000;
    } else {
        bid = parseFloat(strBid);
    }

    return { bid, nickName };
}
