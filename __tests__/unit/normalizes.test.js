const normalizes = require('../../src/utils/normalizes')
const barcodeArrayConsume = [
    "82610000000",
    "7",
    "95740006305",
    "4",
    "00984777404",
    "0",
    "06043681215",
    "4",
]
const barcodeArrayBillet = [
    "001905009",
    "5",
    "4014481606",
    "9",
    "0680935031",
    "4",
    "3",
    "37370000000100",
]

test('Function onlyNumbers --Success Case', () => {
    const result = normalizes.onlyNumbers('0a1b2c3.4-5*6-7 8A9')
    expect(result).toBe('0123456789')
})

test('Function AmountToFixed --Success Case', () => {
    const result = normalizes.amountToFixed('215050', 2)
    expect(result).toBe("2150.50")
})

test('Function factoryDueData --Success Case', () => {
    const result = normalizes.factoryDueData(3789)
    expect(result).toBe('2010-11-17')
})

test('Function validateAndFormatDate --Success Case', () => {
    const result = normalizes.validateAndFormatDate('20221117')
    expect(result).toBe('2022-11-17')
})

test('Function normalizeReturnByValidation --Success Case', () => {
    const result = normalizes.normalizeReturnByValidation([
        {
            module: "1.2",
            isValid: true,
        },
        {
            module: "1.3",
            isValid: false,
        },
    ])
    expect(result).toBe('Err-101.3: A primeira parte do seu código apresenta erro na validação \n')
})

test('Function validateAndFormatDate --Success Case', () => {
    const result = normalizes.removeOnePositionInString({ string: '0123X56789', position: 4 })
    expect(result).toBe('012356789')
})

test('Function getBarcode44Positions --Success Case', () => {
    const result = normalizes.getBarcode44Positions({ barCodeCutInArray: barcodeArrayConsume , type:'consumptionAccounts' })
    expect(result).toBe('82610000000957400063050098477740406043681215')
})

test('Function getBarcode44Positions --Success Case', () => {
    const result = normalizes.getBarcode44Positions({ barCodeCutInArray: barcodeArrayBillet  })
    expect(result).toBe('00193373700000001000500940144816060680935031')
})
