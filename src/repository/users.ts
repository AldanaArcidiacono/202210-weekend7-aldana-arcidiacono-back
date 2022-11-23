import { User, UserI } from '../entities/users.js';
import { passwdEncrypt } from '../services/auth.js';
import { BasicData, id } from './data.js';
import createDebug from 'debug';
const debug = createDebug('W7CH:repository:user');

export class UsersRepository implements BasicData<UserI> {
    static instance: UsersRepository;

    public static getInstance(): UsersRepository {
        if (!UsersRepository.instance) {
            UsersRepository.instance = new UsersRepository();
        }
        return UsersRepository.instance;
    }

    #Model = User;
    private constructor() {
        debug('instance');
    }

    async get(id: id): Promise<UserI> {
        debug('get', id);
        const result = await this.#Model.findById(id);
        if (!result) throw new Error('Not found id');
        return result;
    }

    async post(data: Partial<UserI>): Promise<UserI> {
        debug('post', data);
        if (typeof data.password !== 'string') throw new Error('');
        data.password = await passwdEncrypt(data.password);
        const result = await this.#Model.create(data);
        return result as unknown as UserI;
    }

    async find(search: { [key: string]: string }): Promise<UserI> {
        debug('find', { search });
        const result = await this.#Model.findOne(search);
        if (!result) throw new Error('Not found id');
        return result;
    }

    // async addRobot(user: User, robot: Robot) {
    //     //this.get(user.id)
    //     user.robots.push(robot)
    //     this.#Model
    //     return
    // }

    getUserModel() {
        return this.#Model;
    }
}
