/* eslint-disable no-undef */
const validations = require('../../src/utils/validations')

const mock = {
  firstModule: '001905009',
  firstModuleDigit: '5',
  firstModuleConsume: '82610000000',
  barcode11: '00193373700000001000500940144816060680935031',
  barcode10: '82610000000957400063050098477740406043681215',
  type: 'consumptionAccounts',
  rulesByDigit: {
    2: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    3: [6, 7, 8, 9],
  },
}

test('Validate by module10 --Success Case', () => {
  const result = validations.ValidationByModule10({
    value: mock.firstModule,
    digit: mock.firstModuleDigit,
    initialDigit: 2,
  })
  expect(result).toBe(true)
})

test('Validate by module11 DV--Success Case', () => {
  const result = validations.ValidationByModule11({ barCode: mock.barcode11 })
  expect(result).toBe(true)
})

test('Validate by module10 DV --Success Case', () => {
  const result = validations.validationConsumptionAccountsByModule10({
    barCode: mock.barcode10,
  })
  expect(result).toBe(true)
})

test('Validate by module10 DV --Success Case', () => {
  const result = validations.validationInitialDigitsConsumptionAccounts({
    barCode: mock.firstModuleConsume,
    rulesByDigit: mock.rulesByDigit,
  })
  expect(result[0].isValid).toBe(true)
  expect(result[1].isValid).toBe(true)
})
