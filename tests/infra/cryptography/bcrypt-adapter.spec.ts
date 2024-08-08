import bcrypt from 'bcrypt'
import { BcrypterAdapter } from '@/infra/cryptography'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => { resolve('hashed_value') })
  }
}))

describe('Bcrypt Adapter', () => {
  it('should call brcypt with correct value', async () => {
    const salt = 12
    const sut = new BcrypterAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('should return a hash on success', async () => {
    const salt = 12
    const sut = new BcrypterAdapter(salt)
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hashed_value')
  })
})
