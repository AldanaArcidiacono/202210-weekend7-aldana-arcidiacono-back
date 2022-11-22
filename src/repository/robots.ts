import mongoose, { model } from 'mongoose';
import { ProtoRobot, Robot, robotSchema } from '../entities/robots.js';
import { Data, id } from './data.js';

export class RobotRepository implements Data<Robot> {
    #Model = model('Robot', robotSchema, 'robots');

    async getAll(): Promise<Array<Robot>> {
        return this.#Model.find();
    }

    async get(id: id): Promise<Robot> {
        const result = await this.#Model.findById(id);
        if (!result) throw new Error('Not found id');
        return result as Robot;
    }

    async find(search: {
        [key: string]: string | number | Date;
    }): Promise<Robot> {
        const result = await this.#Model.findOne(search); //as Robot;
        if (!result) throw new Error('Not found id');
        return result as unknown as Robot;
    }

    async post(newRobot: ProtoRobot): Promise<Robot> {
        newRobot.date = this.#generateDate(newRobot.date as string);
        const result = await this.#Model.create(newRobot);
        return result as Robot;
    }

    async patch(id: id, updateRobot: Partial<Robot>): Promise<Robot> {
        const result = await this.#Model.findByIdAndUpdate(id, updateRobot, {
            new: true,
        });
        if (!result) throw new Error('Not found id');
        return result as Robot;
    }

    async delete(id: id): Promise<{ id: id }> {
        const result = await this.#Model.findByIdAndDelete(id);
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
