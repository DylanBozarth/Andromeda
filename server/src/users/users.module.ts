import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './user.controller';
import { MongooseModule } from "@nestjs/mongoose"
import { UserSchema } from "../schema/usersSchema"

@Module({
  imports: [MongooseModule.forFeature([{ name: "user", schema: UserSchema }])],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UserModule {}