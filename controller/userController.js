const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
// const fs = require("fs");
const User = require("../model/userModel");

/**
 * @method addNewUser Crear Usuario
 * @description Crea un nuevo usuario.
 * TODO: devuelve un token JWT
*/
exports.addNewUser = async(req, res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ status:400, message:"Error in validating input data", data: errors.array() });

        let user = new User();
        req.body.password = await bcrypt.hash(req.body.password, 10)
        let resultPOST = await user.save(req.body);
        if(resultPOST.status == 200) return res.status(resultPOST.status).json(resultPOST);
        delete req.body.password;
        req.body._id = resultPOST.data.insertedId;
        // const SECRET_KEY = fs.readFileSync('./certificate.csr');        
        // const token = jwt.sign(req.body, SECRET_KEY.toString('utf8'), {expiresIn: 1800000});
        const token = jwt.sign(req.body, process.env.EXPRESS_SECRET_KEY, {expiresIn: 1800000});
        req.session.auth = token;
        return res.status(202).json({status: 202, message: "User created and logged in"});
    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err)
    }
}
/**
 * @method signInUser Iniciar Sesión
 * @description Permite a un usuario iniciar sesión.
 * TODO: obtener un token JWT
*/
exports.signInUser = async(req, res)=>{
    try {
        let user = new User();
        let resultPOST = await user.login(req.body);
        if(resultPOST.status == 404) return res.status(resultPOST.status).json(resultPOST);
        req.body.password = await bcrypt.compare(req.body.password, resultPOST.data.password);
        if(!req.body.password) return res.status(401).json({status: 401, message: "Incorrect password"});
        req.body = resultPOST.data;
        delete req.body.password;
        // const SECRET_KEY = fs.readFileSync('./certificate.csr');        
        // const token = jwt.sign(req.body, SECRET_KEY.toString('utf8'), {expiresIn: 1800000});
        const token = jwt.sign(req.body, process.env.EXPRESS_SECRET_KEY, {expiresIn: 1800000});
        req.session.auth = token;
        return res.status(202).json({status: 202, message: "Logged in"});
    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err)
    }
}
/**
 * @method logoutUser Cerrar Sesión
 * @description Permite a un usuario cerrar sesión.
 * TODO: opcional
*/
exports.logoutUser = async(req, res)=>{
    try {
        const token = req.session.auth;
        // const SECRET_KEY = fs.readFileSync('./certificate.csr');
        // const decoded = jwt.verify(token, SECRET_KEY.toString('utf8'));
        const decoded = jwt.verify(token, process.env.EXPRESS_SECRET_KEY);

        const { exp, iat, ...payload } = decoded;
        const newToken = jwt.sign(payload,  SECRET_KEY.toString('utf8'), { expiresIn: -9999 }); //Caducar el jwt
        req.session.auth = newToken;
        req.session.auth.maxAge = .1 * 60 * 1000; // 1 segundo a la cookie
        return res.status(200).json({status: 200, message: "User logged out"});
    } catch (error) {
        return res.status(500).json(err)
    }
}
/**
 * @method updateUserById Actualizar Usuario
 * @description Actualiza la información del usuario específico
 * TODO: opcional y solo admin
*/
exports.updateUserById = async(req, res)=>{
    try {
        
    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err)
    }
}
/**
 * @method deleteUserById Eliminar Usuario
 * @description Elimina un usuario específico
 * TODO: opcional y solo admin
*/
exports.deleteUserById = async(req, res)=>{
    try {
        
    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err)
    }
}