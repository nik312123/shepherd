export function roundToNearestMultiple(numberToRound, intMultipleBase) {
    const sign = numberToRound >= 0 ? 1 : -1;
    let result = sign * numberToRound + Math.floor(intMultipleBase / 2);
    result -= result % intMultipleBase;
    return sign * result;
}
