import mongoose, { model, Schema } from 'mongoose';
import { ProtoRobot, Robot } from '../entities/robots.js';
import { Data, id } from './data.js';

export class RobotRepository implements Data<Robot> {
    #schema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true,
        },
        img: String,
        speed: Number,
        strength: Number,
        creationDate: String,
    });

    #Model = model('Robot', this.#schema, 'robots');

    constructor() {
        this.#schema.set('toJSON', {
            transform: (_document, returnedObject) => {
                returnedObject.id = returnedObject._id;
                delete returnedObject.__v;
                delete returnedObject._id;
            },
        });
    }

    async getAll(): Promise<Array<Robot>> {
        return this.#Model.find();
    }

    async get(id: id): Promise<Robot> {
        const result = await this.#Model.findById(id);
        if (!result) throw new Error('Not found id');
        return result as Robot;
    }

    async post(newRobot: ProtoRobot): Promise<Robot> {
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

    #disconnect() {
        mongoose.disconnect();
        console.log(mongoose.connection.readyState);
    }

    getModel() {
        return this.#Model;
    }
}
