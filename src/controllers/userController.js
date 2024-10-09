import { Router } from "express";


import userService from "../services/userService.js";
import { getErrorMessage } from '../utils/errorUtil.js'

const router = Router();

router.get('/register', (req,res) => {
    res.render('auth/register');

});

router.post ('/register', async (req, res) => {
    const {email, password, rePassword} = req.body;

     // Validate email format using validator library
    // if (!validator.isEmail(email)) {
    //     return res.status(400).end();
    // }

    // Validate if repassword is the same
    // if (password !== rePassword) {
    //     return res.status(400).end();
    // }

    if (rePassword !== password) {
        return res.render('auth/register', { email, error: 'Password missmatch!' });
    }

try{
    await userService.register(email, password, rePassword);
} catch (error){
    return res.render('auth/register', { error: getErrorMessage(error), email });
}
    
    const token = await userService.login(email, password);

    res.cookie ('auth', token, { httpOnly: true});

    res.redirect('/');


});

router.get('/login', (req, res) => {
    res.render('auth/login');

});

router.post('/login', async (req, res) =>{
    const { email, password} = req.body;
try{
    const token = await userService.login(email, password);

    res.cookie('auth', token, {httpOnly: true });
}catch (error){
    return res.render('auth/login', { email, error: getErrorMessage(error) });
}
    

    res.redirect('/');

});

router.get('/logout', (req, res) => {
    res.clearCookie('auth');

    res.redirect('/');

});

export default router;