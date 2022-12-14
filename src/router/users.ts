import { Router } from 'express';
import { UsersController } from '../controllers/users.js';
import { RobotRepository } from '../repository/robots.js';
import { UsersRepository } from '../repository/users.js';

export const usersRouter = Router();

const controller = new UsersController(
    UsersRepository.getInstance(),
    RobotRepository.getInstance()
);

usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
