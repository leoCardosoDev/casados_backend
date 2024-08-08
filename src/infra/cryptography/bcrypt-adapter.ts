import bcrypt from 'bcrypt'
import { type Encrypter } from '@/application/protocols'

export class BcrypterAdapter implements Encrypter {
  constructor (private readonly salt: number) {}
  async encrypt (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }
}
