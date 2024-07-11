export const removeTrailingDecimal = (balance: string, limitDecimalDigit: number = 2) => {
    if (!balance) return '0'
    try {
        const regexPattern = '^-?\\d+(?:\\.\\d{0,' + limitDecimalDigit + '})?'
        const removedTrailingBalance = balance.toString().match(regexPattern)?.[0]
        const removedTrailingZero = removedTrailingBalance?.replace(/^0+(?!\.)|(?:\.|(\..*?))0+$/gm, '$1') || '0'
        return removedTrailingZero
    } catch (e) {
        return '0'
    }
}
