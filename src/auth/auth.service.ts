import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserInterface } from 'src/interfaces/user';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private jwtService: JwtService) { }
    async validateUser(username: string, password: string): Promise<UserInterface> {
        const user = await this.usersService.getUser({ username });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const passwordValid = await bcrypt.compare(password, user.password);
        if (passwordValid) {
            return user; // Successful login
        } else {
            throw new UnauthorizedException('Invalid password');
        }
    }
    async login(user: UserInterface) {
        const payload = { username: user.username, sub: user.password };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
