export const getTransactionClass = (number: number) => {
    console.log('number', number)
    if (number < 0 || number > 550000000) {
        throw new Error('Number must be between 0 and 550')
    }

    // Define ranges and corresponding classes
    const ranges = [
        { min: 0, max: 36666666.67, class: 'transaction-0' },
        { min: 36666666.67, max: 73333333.33, class: 'transaction-1' },
        { min: 73333333.33, max: 110000000, class: 'transaction-2' },
        { min: 110000000, max: 146666666.67, class: 'transaction-3' },
        { min: 146666666.67, max: 183333333.33, class: 'transaction-4' },
        { min: 183333333.33, max: 220000000, class: 'transaction-5' },
        { min: 220000000, max: 256666666.67, class: 'transaction-6' },
        { min: 256666666.67, max: 293333333.33, class: 'transaction-7' },
        { min: 293333333.33, max: 330000000, class: 'transaction-8' },
        { min: 330000000, max: 366666666.67, class: 'transaction-9' },
        { min: 366666666.67, max: 403333333.33, class: 'transaction-10' },
        { min: 403333333.33, max: 440000000, class: 'transaction-11' },
        { min: 440000000, max: 476666666.67, class: 'transaction-12' },
        { min: 476666666.67, max: 513333333.33, class: 'transaction-13' },
        { min: 513333333.33, max: 550000000, class: 'transaction-14' },
    ]

    // Find the correct class based on the number
    for (let i = 0; i < ranges.length; i++) {
        if (number >= ranges[i].min && number <= ranges[i].max) {
            console.log('ranges[i].class', ranges[i].class)
            return ranges[i].class
        }
    }

    // Default return (shouldn't reach here if number is valid)
    return 'transaction-0' // Default to lowest class if out of range
}
