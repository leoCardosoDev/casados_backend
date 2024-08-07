import { type AccountModel } from '@/domain/models'
import { type CreateAccount, type CreateAccountModel } from '@/domain/usecases'
import { type CreateAccountRepository, type Encrypter } from '@/application/protocols'

export class DbCreateAccount implements CreateAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly createAccountRepository: CreateAccountRepository
  ) { }

  async create (accountData: CreateAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    const account = await this.createAccountRepository.create(Object.assign({}, accountData, { password: hashedPassword }))
    return account
  }
}
