
const userService = require('../services/userService');
const register = async (req, res) => {
    try {
        const { email, password,name,country } = req.body;
        const user = await userService.register({ email, password,name,country });
        res.status(201).send({ user });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};
const updateUser = async (req, res) => {
    try {
        const { email,name,country,role } = req.body;
         const id = req.params.id;
        const user = await userService.updateUser(id,{ email,name,country,role });
        res.status(201).send({ user });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};
const registerByAdmin = async (req, res) => {
    try {
        const { email, password,name,country,role } = req.body;
        const user = await userService.registerByAdmin({ email, password,name,country,role });
        res.status(201).send({ user });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { role, token ,mail} = await userService.login(email, password);
        
        res.status(200).send({ role, token ,mail});
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const result = await userService.verifyEmail(token);
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};
const GetUserByIds = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.findById(id);
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};
const GetUserByROLE = async (req, res) => {
    try {
      
        const user = await userService.findByrole();
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};
const deleted = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.deleted(id);
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};
const findByAll = async (req, res) => {
    try {
        const users = await userService.findByAll();
        res.status(200).send(users);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};
const findByroleUser = async (req, res) => {
    try {
        const users = await userService.findALLUSER();
        res.status(200).send(users);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};
module.exports = {
    register,
    login,
    verifyEmail,
    GetUserByIds,
    registerByAdmin,
    findByAll,
    deleted,
    GetUserByROLE,
    findByroleUser,
    updateUser
};

