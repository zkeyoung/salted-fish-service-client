import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigVariables } from '../../../config';
import { ReqUser } from '../../../decorator/req-user';
import CryptoService from '../../crypto/service';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly tokenConfig = this.configService.get('token', {
    infer: true,
  });

  constructor(
    private readonly configService: ConfigService<ConfigVariables>,
    private readonly cryptoService: CryptoService,
  ) {
    super({
      secretOrKey: configService.get('token', { infer: true }).TOKEN_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  validate(payload: { encrypt: string }) {
    const reqUserBuffer = this.cryptoService.aesDecode(
      Buffer.from(payload.encrypt, 'hex'),
      this.tokenConfig.TOKEN_PAYLOAD_SECRET,
    );
    const reqUser: ReqUser = JSON.parse(reqUserBuffer.toString('utf8'));
    return reqUser;
  }
}
