import { type AccountModel } from '@/domain/models'
import { type CreateAccountModel } from '@/domain/usecases'

export interface CreateAccountRepository {
  create: (accountData: CreateAccountModel) => Promise<AccountModel>
}
