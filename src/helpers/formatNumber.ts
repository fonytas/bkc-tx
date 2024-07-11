export const formatNumber = (number: number) => {
    // Use the toLocaleString method to add suffixes to the number
    return number.toLocaleString('en-US', {
        // add suffixes for thousands, millions, and billions
        // the maximum number of decimal places to use
        maximumFractionDigits: 0,
        // specify the abbreviations to use for the suffixes
        notation: 'compact',
        compactDisplay: 'short',
    })
}
