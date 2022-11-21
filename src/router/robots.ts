import { Router } from 'express';
import { RobotController } from '../controllers/robots.js';
import { logged } from '../middleware/interceptor.js';
import { RobotRepository } from '../repository/robots.js';

export const robotsRouter = Router();

const controller = new RobotController(new RobotRepository());

robotsRouter.get('/', logged, controller.getAll.bind(controller));
robotsRouter.get('/:idRobot', logged, controller.get.bind(controller));
robotsRouter.post('/create', logged, controller.post.bind(controller));
robotsRouter.patch(
    '/update/:idRobot',
    logged,
    controller.patch.bind(controller)
);
robotsRouter.delete(
    '/delete/:idRobot',
    logged,
    controller.delete.bind(controller)
);
