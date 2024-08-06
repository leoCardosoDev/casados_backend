import { DbCreateAccount } from '@/application/usecases'
import { type Encrypter } from '@/application/protocols'

interface SutType {
  sut: DbCreateAccount
  encrypterStub: Encrypter
}

const makeSut = (): SutType => {
  class EncrypterStub {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => { resolve('hashed_password') })
    }
  }

  const encrypterStub = new EncrypterStub()
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
})
