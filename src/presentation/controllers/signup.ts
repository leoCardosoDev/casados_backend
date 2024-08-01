export class SignUpController {
  handle (httpRequest: any): any {
    if (!httpRequest.body.codeInvitation) {
      return {
        statusCode: 400,
        body: new Error('Missing param: code invitation')
      }
    }
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
    }
  }
}
