import { model } from 'mongoose';
import { User, userSchema } from '../entities/users.js';
import { passwdEncrypt } from '../services/auth.js';
import { BasicData, id } from './data.js';

export class UsersRepository implements BasicData<User> {
    #Model = model('User', userSchema, 'users');

    async get(id: id): Promise<User> {
        const result = (await this.#Model.findById(id)) as User;
        if (!result) throw new Error('Not found id');
        return result;
    }

    async post(data: Partial<User>): Promise<User> {
        if (typeof data.password !== 'string') throw new Error('');
        data.password = await passwdEncrypt(data.password);
        const result = await this.#Model.create(data);
        return result as unknown as User;
    }

    async find(search: { [key: string]: string }): Promise<User> {
        const result = (await this.#Model.findOne(search)) as User;
        if (!result) throw new Error('Not found id');
        return result;
    }

    getUserModel() {
        return this.#Model;
    }
}
