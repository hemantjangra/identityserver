import { check } from 'express-validator';

check('client_id')
    .exists()
    .not()
    .isEmpty()
    .withMessage('client_id not present in request for Authorization endpoint');

check('response_type')
    .exists()
    .not()
    .isEmpty()
    .isIn(['code'])
    .withMessage('response_type not present in request for Authorization endpoint');


