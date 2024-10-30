const { body } = require("express-validator")
exports.addNewUser = [
    body('name').notEmpty().isString().matches(/^[a-zA-Z\s]+$/).withMessage(`Sent the user's name to register`),
    body('nickName').notEmpty().isString().withMessage(`Sent the user's nick name to register`),
    body('password').notEmpty().isString().isLength({ min: 8 }).trim().withMessage(`Sent the user's password to register`),
    body('email').notEmpty().isEmail().withMessage(`Sent the user's email to register`)
];


















// exports.addNewUser = () => {
//     return [
//         body('name').notEmpty().withMessage('La cedula tiene no puede estar vacía'),
//         body('nickName').notEmpty().withMessage('El nombre del paciente no puede estar vacío'),
//         body('password').notEmpty().withMessage('El nombre del paciente no puede estar vacío'),
//         body('email').notEmpty().withMessage('El genero del paciente no puede estar vacío'),
//         body('fecha_nacimiento').notEmpty().withMessage('La fecha del paciente no puede estar vacío'),
//         body('edad').notEmpty().withMessage('La edad del paciente no puede estar vacío'),
//         body('estado').notEmpty().exists().custom((value)=>{
//             // if(value == "Activo") return true
//             // if(value == "Inactivo") return true
//             // throw new Error(`La opciones disponibles son 'Activo', 'Inactivo'`);
//             if (value && !['Activo', 'Inactivo'].includes(value)) {
//                 throw new Error(`El dato no esta permitido`);
//             }
//             return true;
//         })
//     ];
// }
