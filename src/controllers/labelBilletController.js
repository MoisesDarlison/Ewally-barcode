const labelBilletService = require('../services/labelBilletService')
const rules = require('../utils/barCodeRules.json')
const normalizes = require('../utils/normalizes')

module.exports = {
    /***
       * Validate BarCode 
       * @param {string} barCode
       */
    async validate(request, response) {
        try {
            const barCode = normalizes.onlyNumbers(request.params.barCode || '')
            const type = labelBilletService.getRulesLabelBillet({ barCode })
            const barCodeFormatted = labelBilletService.validateDigitsBarCode({ barCode, rules: rules[type], type })
            const expirationDate = labelBilletService.getExpirationDate({ barCode, type })
            const amount = labelBilletService.getAmount({ barCode, type })

            return response.status(200).json({ barCode: barCodeFormatted, amount, expirationDate })
        } catch (error) {
            console.log(error.message)
            return response.status(error.status || 500).json({ message: error.message })
        }
    }
}