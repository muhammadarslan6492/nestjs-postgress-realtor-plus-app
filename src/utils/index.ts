import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class Utils {
  private readonly secretKey = process.env.JWT;

  async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hashPassword);
    return isMatch;
  }

  generateToken(payload: any): string {
    const token = jwt.sign(payload, this.secretKey);
    return token;
  }

  verifyToken(token: string): any {
    const decoded = jwt.verify(token, this.secretKey);
    return decoded;
  }

  generateHash(data: any): string {
    return bcrypt.hash(data, 10);
  }
}
