import mongoose, { Types } from 'mongoose';
import { ProtoRobotI, RobotI, Robot } from '../entities/robots.js';
import { Data, id } from './data.js';
import createDebug from 'debug';
const debug = createDebug('W7CH:repository:robots');

export class RobotRepository implements Data<RobotI> {
    static instance: RobotRepository;

    public static getInstance(): RobotRepository {
        if (!RobotRepository.instance) {
            RobotRepository.instance = new RobotRepository();
        }
        return RobotRepository.instance;
    }

    #Model = Robot;

    private constructor() {
        debug('instance');
    }

    async getAll(): Promise<Array<RobotI>> {
        debug('getAll');
        return this.#Model.find().populate('owner', {
            robots: 0,
        });
    }

    async get(id: id): Promise<RobotI> {
        debug('get', id);
        const result = await this.#Model
            .findById(id)
            .populate<{ _id: Types.ObjectId }>('owner');
        if (!result) throw new Error('Not found id');
        return result;
    }

    async find(search: {
        [key: string]: string | number | Date;
    }): Promise<RobotI> {
        debug('find', { search });
        const result = await this.#Model.findOne(search).populate('owner', {
            robots: 0,
        });
        if (!result) throw new Error('Not found id');
        return result as RobotI;
    }

    async post(newRobot: ProtoRobotI): Promise<RobotI> {
        debug('post', newRobot);
        newRobot.date = this.#generateDate(newRobot.date as string);
        const result = await (
            await this.#Model.create(newRobot)
        ).populate('owner', {
            robots: 0,
        });
        return result;
    }

    async patch(id: id, updateRobot: Partial<RobotI>): Promise<RobotI> {
        debug('patch', id);
        const result = await this.#Model
            .findByIdAndUpdate(id, updateRobot, {
                new: true,
            })
            .populate('owner', {
                robots: 0,
            });
        if (!result) throw new Error('Not found id');
        return result;
    }

    async delete(id: id): Promise<{ id: id }> {
        debug('delete', id);
        const result = await this.#Model
            .findByIdAndDelete(id)
            .populate('owner', {
                robots: 0,
            });
        if (result === null) throw new Error('Not found id');
        return { id: id };
    }

    disconnect() {
        mongoose.disconnect();
    }

    #generateDate(date: string | undefined) {
        if (!date) return new Date();
        const validDate =
            new Date(date) === new Date('') ? new Date() : new Date(date);
        return validDate;
    }

    getModel() {
        return this.#Model;
    }
}
