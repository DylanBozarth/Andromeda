import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { UserInterface } from 'src/interfaces/user';

@Controller('auth')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post("/register")
    async createUser(
        @Body("password") password: string,
        @Body("username") username: string
    ): Promise<UserInterface> {
        console.log({ password, username });
        const saltOrRounds = 10; //Will use later
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);
        const result = await this.usersService.createUser(username, hashedPassword);
        console.log(result);
        return result;
    }
}