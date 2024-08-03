import { type Controller, type HttpRequest, type HttpResponse } from '@/presentation/protocols'
import { badRequest, serverError } from '@/presentation/helpers'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { type CreateAccount } from '@/domain/usecases'
import { type EmailValidator } from '@/validation/protocols'

export class SignUpController implements Controller {
  private readonly emailValidator
  private readonly createAccount
  constructor (emailValidator: EmailValidator, createAccount: CreateAccount) {
    this.emailValidator = emailValidator
    this.createAccount = createAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      this.createAccount.create({
        name,
        email,
        password
      })
      return {
        statusCode: 200,
        body: { message: 'Success' }
      }
    } catch (error) {
      return serverError()
    }
  }
}
