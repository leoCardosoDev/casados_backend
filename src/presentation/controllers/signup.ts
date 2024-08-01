import { type Controller, type EmailValidator, type HttpRequest, type HttpResponse } from '@/presentation/protocols'
import { badRequest, serverError } from '@/presentation/helpers'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'

export class SignUpController implements Controller {
  private readonly emailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['codeInvitation', 'name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      return {
        statusCode: 200,
        body: { message: 'Success' }
      }
    } catch (error) {
      return serverError()
    }
  }
}
