/* eslint-disable no-undef */
const BadRequestException = require('../../src/err/BadRequestException')

function testException() {
  throw new BadRequestException('Error Test')
}

test('Class BadRequestException --Success Case', () => {
  expect(testException).toThrow(Error)
  expect(testException).toThrow('Error Test')
})
