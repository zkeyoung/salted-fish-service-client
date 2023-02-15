import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ReqUser } from '../../decorator/req-user';
import JwtStrategy from '../auth/strategies/jwt';

@Injectable()
export default class WsService {
  constructor(
    private readonly jwtStrategy: JwtStrategy,
    private readonly jwtService: JwtService,
  ) {}

  async parseJwtLoginToken(token: string): Promise<ReqUser> {
    const payload = await this.jwtService.verifyAsync<{ encrypt: string }>(
      token,
    );
    return this.jwtStrategy.validate(payload);
  }
}
