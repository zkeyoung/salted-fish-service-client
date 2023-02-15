import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigVariables } from '../../config';
import CryptoModule from '../crypto';
import UserModule from '../user';
import AuthController from './controller';
import AuthService from './service';
import JwtStrategy from './strategies/jwt';
import LocalStrategy from './strategies/local';

@Module({
  imports: [
    PassportModule,
    UserModule,
    CryptoModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<ConfigVariables>) => {
        const tokenConfig = configService.get('token', { infer: true });
        return {
          secret: tokenConfig.TOKEN_SECRET,
          signOptions: {
            audience: 'zzu',
            expiresIn: tokenConfig.TOKEN_EXPIRE,
            issuer: 'salted-fash-market',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, JwtStrategy, JwtModule],
})
export default class AuthModule {}
