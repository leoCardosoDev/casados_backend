import { type AccountModel } from '@/domain/models'

export interface CreateAccount {
  create: (account: CreateAccountModel) => AccountModel
}

export interface CreateAccountModel {
  name: string
  email: string
  password: string
}
