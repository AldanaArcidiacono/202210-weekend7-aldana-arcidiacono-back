import { model } from 'mongoose';
import { User, userSchema } from '../entities/users.js';
import { passwdEncrypt } from '../services/auth.js';
import { BasicData, id } from './data.js';

export class UsersRepository implements BasicData<User> {
    #Model = model('User', userSchema, 'users');

    async get(id: id) {
        const result = await this.#Model.findById(id);
        if (!result) throw new Error('Not found id');
        return result as User;
    }

    async post(data: Partial<User>): Promise<User> {
        if (typeof data.password !== 'string') throw Error('');
        data.password = await passwdEncrypt(data.password);
        const result = await this.#Model.create(data);
        return result as User;
    }

    async findOne(search: any): Promise<User> {
        const result = await this.#Model.findOne(search);
        if (!result) throw new Error('User not found');
        return result as unknown as User;
    }

    getUserModel() {
        return this.#Model;
    }
}
