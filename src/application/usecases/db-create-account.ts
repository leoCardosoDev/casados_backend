import { type AccountModel } from '@/domain/models'
import { type CreateAccountModel } from '@/domain/usecases'
import { type Encrypter } from '@/application/protocols'

export class DbCreateAccount {
  constructor (private readonly encrypter: Encrypter) { }

  async create (account: CreateAccountModel): Promise<AccountModel | null> {
    await this.encrypter.encrypt(account.password)
    return new Promise(resolve => { resolve(null) })
  }
}
