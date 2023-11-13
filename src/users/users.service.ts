import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInterface } from 'src/interfaces/user';

@Injectable()
export class UsersService {
    constructor(@InjectModel('user') private readonly userModel: Model<UserInterface>) { }
    async createUser(username: string, password: string): Promise<UserInterface> {
        try {
            const newUser = await this.userModel.create({
                username,
                password,
            });
            return newUser;
        } catch (error) {
            // Handle the error appropriately (e.g., log the error or throw it)
            console.error("Error creating a new user:", error);
            throw error;
        }
    }
    async getUser(query: object): Promise<UserInterface> {
        return this.userModel.findOne(query);
    }
}