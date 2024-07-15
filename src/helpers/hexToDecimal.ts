export const hexToDecimal = (hex: string) => {
    if (!hex) return ''
    return parseInt(hex, 16).toString()
}
