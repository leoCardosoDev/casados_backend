import { EmailValidatorAdapter } from '@/infra/validators'

describe('EmailValidator Adapter', () => {
  it('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email@mail')
    expect(isValid).toBe(false)
  })
})
