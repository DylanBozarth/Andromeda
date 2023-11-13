import { Module } from "@nestjs/common"
import { UserModule } from "../users/users.module";
import { AuthService } from "./auth.service"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UsersService } from "../users/users.service";
import { MongooseModule } from "@nestjs/mongoose"
import { UserSchema } from "../schema/usersSchema"
import { LocalStrategy } from './local.auth';


@Module({
  imports: [UserModule, PassportModule, JwtModule.register({
    secret: process.env.JWTSECRET,
    signOptions: { expiresIn: '60s' },
  }), MongooseModule.forFeature([{ name: "user", schema: UserSchema }])],
  providers: [AuthService, UsersService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule { }