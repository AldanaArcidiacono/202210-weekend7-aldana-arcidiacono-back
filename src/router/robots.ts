import { Router } from 'express';
import { RobotController } from '../controllers/robots.js';
import { RobotRepository } from '../repository/robots.js';

export const robotsRouter = Router();

const controller = new RobotController(new RobotRepository());

robotsRouter.get('/', controller.getAll.bind(controller));
robotsRouter.get('/:idRobot', controller.get.bind(controller));
robotsRouter.post('/create', controller.post.bind(controller));
robotsRouter.patch('/update/:idRobot', controller.patch.bind(controller));
robotsRouter.delete('/delete/:idRobot', controller.delete.bind(controller));
