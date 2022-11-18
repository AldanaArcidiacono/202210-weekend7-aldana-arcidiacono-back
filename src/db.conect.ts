import mongoose from 'mongoose';
import debugCreator from 'debug';
const debug = debugCreator('http');
import { USER, CLUSTER, PASSWORD } from './config.js';

export function dbConnect() {
    const DBName =
        process.env.NODE_ENV !== 'test'
            ? 'WeekendChallenge'
            : 'WeekendChallengeTesting';
    let uri = `mongodb+srv://${USER}:${PASSWORD}`;
    uri += `@${CLUSTER}/${DBName}?retryWrites=true&w=majority`;
    debug({ uri });
    debug(DBName);
    return mongoose.connect(uri);
}
