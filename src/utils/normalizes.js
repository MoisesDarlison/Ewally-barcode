const REGEX = {
    onlyNumber: /[^\d]+/g,
    date: /(\d{4})(\d{2})(\d{2})/
}

const dictionary = {
    '1': 'A primeira parte do seu código',
    '2': 'A segunda parte do seu código',
    '3': 'A terceira parte do seu código',
    '4': 'A quarta parte do seu código',
    'DV': 'O digito verificador',
    '1.2': 'A primeira parte do seu código',
    '1.3': 'A primeira parte do seu código'

}

function getNewPositionByMapped({ barCode }) {
    const mapped = {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 19,
        5: 20,
        6: 21,
        7: 22,
        8: 23,
        9: 24,
        10: 25,
        11: 26,
        12: 27,
        13: 28,
        14: 29,
        15: 30,
        16: 31,
        17: 32,
        18: 33,
        19: 34,
        20: 35,
        21: 36,
        22: 37,
        23: 38,
        24: 39,
        25: 40,
        26: 41,
        27: 42,
        28: 43,
        29: 4,
        30: 5,
        31: 6,
        32: 7,
        33: 8,
        34: 9,
        35: 10,
        36: 11,
        37: 12,
        38: 13,
        39: 14,
        40: 15,
        41: 16,
        42: 17,
        43: 18
    }

    const mappedBarCode = new Array(44)
    const barCodeToArray = barCode.split('')

    //Preenche o novo array de acordo com o mapeamento do manual
    barCodeToArray.forEach((digit, index) => {
        mappedBarCode[mapped[index]] = digit
    })

    return mappedBarCode.join('')
}

module.exports = {
    onlyNumbers(barCode) {
        return barCode.replace(REGEX.onlyNumber, "")
    },

    amountToFixed(amount, toFixed) {
        const amountNorm = parseFloat(amount) / 100
        return amountNorm.toFixed(toFixed)
    },

    factoryDueData(factoryDueData) {
        const initialDate = new Date(2000, 6, 3)//inicia em 1000 para 03/07/2000
        if (Number(factoryDueData) > 1000) return new Date(initialDate.setDate(initialDate.getDate() + factoryDueData)).toLocaleDateString('sv-SE')
        return null
    },

    validateAndFormatDate(date) {
        const dateRegex = date.replace(REGEX.date, "$1/$2/$3")

        const dateFormatted = new Date(dateRegex)
        if (dateFormatted.toString() === 'Invalid Date') return null
        const nowDate = new Date()

        if (nowDate.getFullYear() <= dateFormatted.getFullYear() &&
            nowDate.getFullYear() + 10 >= dateFormatted.getFullYear()) {
            return dateFormatted.toLocaleDateString('sv-SE')
        }
        return null
    },

    normalizeReturnByValidation(validation) {
        let fails = ''
        validation.map((data, index) => {
            if (!data.isValid) {
                fails += `Err-10${data.module}: ${dictionary[data.module]} apresenta erro na validação \n`
            }
        })
        return fails
    },

    removeOnePositionInString({ string, position }) {
        const stringToArray = string.split('')
        stringToArray.splice(position, 1)
        return stringToArray.join('')
    },

    getBarcode44Positions({ barCodeCutInArray, type }) {
        if (type === 'consumptionAccounts') {
            return barCodeCutInArray[0] + barCodeCutInArray[2] + barCodeCutInArray[4] + barCodeCutInArray[6]
        }

        const barCode = barCodeCutInArray[0] + barCodeCutInArray[2] + barCodeCutInArray[4] + barCodeCutInArray[6] + barCodeCutInArray[7]
        return getNewPositionByMapped({ barCode })
    }

}