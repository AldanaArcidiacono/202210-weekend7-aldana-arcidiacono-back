import { model, Schema, Types } from 'mongoose';

export type ProtoUserI = {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    robots?: Array<Types.ObjectId>;
};

export type UserI = {
    id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: string;
    robots: Array<Types.ObjectId>;
};

export const userSchema = new Schema<UserI>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: String,
    password: String,
    role: String,
    robots: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Robots',
        },
    ],
});

userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
        delete returnedObject.password;
    },
});

export const User = model<UserI>('User', userSchema, 'users');
