module.exports = {
  ValidationByModule10({ value, digit, initialDigit }) {
    const barCodeToArray = value.split('')
    const arrayBarCodeMultiples = barCodeToArray.map((number, index) => {
      const numberInteger = Number(number)
      if ((index + initialDigit) % 2) return numberInteger * 1

      let ninesOut = numberInteger * 2
      if (ninesOut > 9) {
        const unit = ninesOut % 10
        const ten = Math.floor(ninesOut / 10)
        ninesOut = ten + unit
      }
      return ninesOut
    })

    const sumBarCode = arrayBarCodeMultiples.reduce(
      (previousValue, currentValue) => previousValue + currentValue
    )

    const restSumBarCode = sumBarCode % 10
    const tenLater = Math.floor(sumBarCode - restSumBarCode + 10) // 10 é uma constante que consegue chegar na proxima dezena
    const digVerificatory = (tenLater - restSumBarCode) % 10
    return digVerificatory === Number(digit)
  },

  ValidationByModule11({ barCode, type }) {
    const barCodeToArray = barCode.split('')
    let isConsumptionAccounts = false
    if (type === 'consumptionAccounts') isConsumptionAccounts = true

    const [verifyDigit] = isConsumptionAccounts
      ? barCodeToArray.splice(3, 1)
      : barCodeToArray.splice(4, 1)
    barCodeToArray.reverse() //O produto inicia do fim do array

    let counterInterval = 1
    const multipliersBarcodeResult = barCodeToArray.map((digit) => {
      if (counterInterval > 8) {
        counterInterval = 2
      } else {
        counterInterval += 1
      }
      return Number(digit) * counterInterval
    })

    const sumBarCode = multipliersBarcodeResult.reduce(
      (previousValue, currentValue) => previousValue + currentValue
    )
    const elevenOut = sumBarCode % 11

    let ValidBarCodeDigit = 11 - elevenOut
    if ([0, 1].includes(elevenOut) && isConsumptionAccounts) {
      ValidBarCodeDigit = 0
    } else if ([10].includes(elevenOut) && isConsumptionAccounts) {
      ValidBarCodeDigit = 1
    } else if ([0, 10, 11].includes(ValidBarCodeDigit)) {
      ValidBarCodeDigit = 1
    }

    return ValidBarCodeDigit === Number(verifyDigit)
  },

  validationConsumptionAccountsByModule10({ barCode }) {
    const barCodeToArray = barCode.split('')
    const [verifyDigit] = barCodeToArray.splice(3, 1)

    const multipliersBarcodeResult = barCodeToArray.map((number, index) => {
      const numberInteger = Number(number)
      if ((index + 2) % 2) return numberInteger * 1

      let ninesOut = numberInteger * 2
      if (ninesOut > 9) {
        const unit = ninesOut % 10
        const ten = Math.floor(ninesOut / 10)
        ninesOut = ten + unit
      }
      return ninesOut
    })

    const sumBarCode = multipliersBarcodeResult.reduce(
      (previousValue, currentValue) => previousValue + currentValue
    )
    const elevenOut = sumBarCode % 10

    let ValidBarCodeDigit = 10 - elevenOut
    if ([0, 10, 11].includes(ValidBarCodeDigit)) ValidBarCodeDigit = 1
    return ValidBarCodeDigit === Number(verifyDigit)
  },

  validationInitialDigitsConsumptionAccounts({ barCode, rulesByDigit }) {
    const barCodeToArray = barCode.split('')
    const InitialDigits = []
    for (const ruleDigit in rulesByDigit) {
      const isValid = rulesByDigit[ruleDigit].includes(
        Number(barCodeToArray[ruleDigit - 1])
      )
      InitialDigits.push({ module: '1.'.concat(ruleDigit), isValid })
    }

    return InitialDigits
  },
}
