import { DbCreateAccount } from '@/application/usecases'
import { type Encrypter } from '@/application/protocols'

interface SutType {
  sut: DbCreateAccount
  encrypterStub: Encrypter
}

const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => { resolve('hashed_password') })
    }
  }
  return new EncrypterStub()
}

const makeSut = (): SutType => {
  const encrypterStub = mockEncrypter()
  const sut = new DbCreateAccount(encrypterStub)
  return {
    sut,
    encrypterStub
  }
}

describe('DbCreateAccount Usecases', () => {
  it('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    await sut.create(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
  // Teste para garantir que caso o encrypter retorne uma Exception, que seja tratada por quem chamou e não aqui
  it('should throws if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const promise = sut.create(accountData)
    await expect(promise).rejects.toThrow()
  })
})
