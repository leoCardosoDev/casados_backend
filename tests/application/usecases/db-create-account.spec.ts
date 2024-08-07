import { DbCreateAccount } from '@/application/usecases'
import { type CreateAccountRepository, type Encrypter } from '@/application/protocols'
import { type AccountModel } from '@/domain/models'
import { type CreateAccountModel } from '@/domain/usecases'

const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => { resolve('hashed_password') })
    }
  }
  return new EncrypterStub()
}

const mockCreateAccountRepository = (): CreateAccountRepository => {
  class CreateAccountRepositoryStub implements CreateAccountRepository {
    async create (accountData: CreateAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'hashed_password'
      }
      return new Promise(resolve => { resolve(fakeAccount) })
    }
  }
  return new CreateAccountRepositoryStub()
}

interface SutType {
  sut: DbCreateAccount
  encrypterStub: Encrypter
  createAccountRepositoryStub: CreateAccountRepository
}

const makeSut = (): SutType => {
  const encrypterStub = mockEncrypter()
  const createAccountRepositoryStub = mockCreateAccountRepository()
  const sut = new DbCreateAccount(encrypterStub, createAccountRepositoryStub)
  return {
    sut,
    encrypterStub,
    createAccountRepositoryStub
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

  it('should call CreateAccountRepository with correct values', async () => {
    const { sut, createAccountRepositoryStub } = makeSut()
    const createSpy = jest.spyOn(createAccountRepositoryStub, 'create')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    await sut.create(accountData)
    expect(createSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
  })

  // Teste para garantir que caso o encrypter retorne uma Exception, que seja tratada por quem chamou e não aqui
  it('should throws if CreateAccountRepository throws', async () => {
    const { sut, createAccountRepositoryStub } = makeSut()
    jest.spyOn(createAccountRepositoryStub, 'create').mockRejectedValueOnce(new Error())
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const promise = sut.create(accountData)
    await expect(promise).rejects.toThrow()
  })
})
