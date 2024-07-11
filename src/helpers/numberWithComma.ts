export const numberWithComma = (input: number | string): string => {
    try {
        if (!input) {
            return ''
        }
        const parts = input.toString().split('.')
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        return parts.join('.')
    } catch {
        return '0'
    }
}
