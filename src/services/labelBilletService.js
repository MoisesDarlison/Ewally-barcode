const utils = require('../utils/validations')
const normalizes = require('../utils/normalizes')
const BadRequestException = require('../err/BadRequestException')

function validationByModule({
  barCodeCutInArray,
  positionArray,
  initialDigit,
}) {
  const value = barCodeCutInArray[positionArray * 2]
  const digit = barCodeCutInArray[positionArray * 2 + 1]
  return utils.ValidationByModule10({ value, digit, initialDigit })
}

function getValidationByDV({ barCodeCutInArray, type }) {
  const barCode = normalizes.getBarcode44Positions({ barCodeCutInArray, type })
  if (type == 'consumptionAccounts') {
    let validationResult = null
    if (['8', '9'].includes(barCodeCutInArray[0][2])) {
      validationResult = utils.ValidationByModule11({ barCode, type })
    } else {
      validationResult = utils.validationConsumptionAccountsByModule10({
        barCode,
      })
    }
    return { module: 'DV', isValid: validationResult }
  }
  const validationResult = utils.ValidationByModule11({ barCode, type })

  return { module: 'DV', isValid: validationResult }
}

function getBarCodeCutInArray({ barCode, modules }) {
  const modulesToArray = Object.entries(modules)
  const array = []
  modulesToArray.forEach((module) => {
    if (module[1].value)
      array.push(barCode.slice(module[1].value.initial, module[1].value.end))
    if (module[1].digit) array.push(barCode[module[1].digit])
  })
  return array
}

function getValidationByModule({
  barCodeCutInArray,
  validationModule,
  rulesByModule,
}) {
  return validationModule.map((module, index) => {
    const { ruleModule, initialDigit } = rulesByModule[module] || {}
    const validationResult = validationByModule({
      ruleModule,
      barCodeCutInArray,
      positionArray: index,
      initialDigit,
    })
    return { module, isValid: validationResult }
  })
}

module.exports = {
  getRulesLabelBillet({ barCode }) {
    if (!barCode)
      throw new BadRequestException(
        'Err-001: Favor enviar um código de barras.'
      )
    if (barCode.length == 48 && '8' === barCode[0]) {
      return 'consumptionAccounts'
    } else if (barCode.length == 47) {
      return 'billingAccounts'
    }
    throw new BadRequestException(
      'Err-002: Tamanho do código de barras invalido. Favor conferir a linha digitavel'
    )
  },

  validateDigitsBarCode({ barCode, rules, type }) {
    const barCodeCutInArray = getBarCodeCutInArray({
      barCode,
      modules: rules.modules,
    })
    const validationModule = getValidationByModule({
      barCodeCutInArray,
      type,
      validationModule: rules.validationByModule,
      rulesByModule: rules.modules,
    })
    if (type == 'consumptionAccounts') {
      const validationInitialDigits =
        utils.validationInitialDigitsConsumptionAccounts({
          barCode: barCodeCutInArray[0],
          rulesByDigit: rules.rulesByDigit,
        })
      validationModule.push(...validationInitialDigits)
    }

    const validationDV = getValidationByDV({ barCodeCutInArray, type })
    const fails = normalizes.normalizeReturnByValidation(
      validationModule.concat(validationDV)
    )
    if (fails) throw new BadRequestException(fails)

    return normalizes.getBarcode44Positions({ barCodeCutInArray, type })
  },

  getExpirationDate({ barCode, type }) {
    if (type === 'consumptionAccounts') {
      let cutDueDate = normalizes.validateAndFormatDate(barCode.slice(26, 34))
      if (!cutDueDate) {
        let cutDate = normalizes.removeOnePositionInString({
          string: barCode.slice(20, 29),
          position: 3,
        })
        cutDueDate = normalizes.validateAndFormatDate(cutDate)
      }
      if (!cutDueDate) return null
      return cutDueDate
    }

    const cutDueDate = barCode.slice(-14, -10)
    const factoryDueData = Math.abs(Number(cutDueDate) - 1000)
    return normalizes.factoryDueData(factoryDueData)
  },

  getAmount({ barCode, type }) {
    if (type === 'consumptionAccounts') {
      let cutAmount = normalizes.removeOnePositionInString({
        string: barCode.slice(4, 16),
        position: 7,
      })
      return normalizes.amountToFixed(cutAmount, 2)
    }
    const cutAmount = barCode.slice(-10, barCode.length)
    return normalizes.amountToFixed(cutAmount, 2)
  },
}
