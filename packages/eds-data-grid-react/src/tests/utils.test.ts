import { addPxSuffixIfInputHasNoPrefix, isNumberOnlyString } from '../utils'

test('Should validate number string correctly', () => {
  expect(isNumberOnlyString('1')).toBe(true)

  expect(isNumberOnlyString('1s')).toBe(false)

  expect(isNumberOnlyString('sa')).toBe(false)

  expect(isNumberOnlyString('1.1')).toBe(true)

  expect(isNumberOnlyString('1,1')).toBe(false)

  expect(isNumberOnlyString('11 ')).toBe(true)
})

test('Should add px suffix in correct cases', () => {
  expect(addPxSuffixIfInputHasNoPrefix('1')).toEqual('1px')
  expect(addPxSuffixIfInputHasNoPrefix('1px')).toEqual('1px')
  expect(addPxSuffixIfInputHasNoPrefix('1.1')).toEqual('1.1px')
  expect(addPxSuffixIfInputHasNoPrefix('100%')).toEqual('100%')
})
