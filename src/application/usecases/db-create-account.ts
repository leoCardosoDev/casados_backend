import { type AccountModel } from '@/domain/models'
import { type CreateAccountModel } from '@/domain/usecases'
import { type CreateAccountRepository, type Encrypter } from '@/application/protocols'

export class DbCreateAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly createAccountRepository: CreateAccountRepository
  ) { }

  async create (accountData: CreateAccountModel): Promise<AccountModel | null> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    await this.createAccountRepository.create(Object.assign({}, accountData, { password: hashedPassword }))
    return new Promise(resolve => { resolve(null) })
  }
}
