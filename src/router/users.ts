import { Router } from 'express';
import { UsersController } from '../controllers/users.js';
import { UsersRepository } from '../repository/users.js';

export const usersRouter = Router();

const controller = new UsersController(new UsersRepository());

usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
