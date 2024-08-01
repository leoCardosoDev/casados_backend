import { SignUpController } from '@/presentation/controllers/signup'

describe('SignUp Controller', () => {
  it('should return 400 if no code invitation is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
