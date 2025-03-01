import express from "express";

import jwt, {Secret} from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserModel } from "../model/UserModel";
import { saveUserService, verifyUserCredentialsService } from "../service/UserService";


dotenv.config();

const router = express.Router();

router.post("/login", async (req, res) => {
    console.log("Enter Login");
    
    const username = req.body.username;
    const password = req.body.password;

    const user: UserModel = new UserModel(username, password);

    try{
        const isVerified =  await verifyUserCredentialsService(username,password);

        if(isVerified){
            const token = jwt.sign({ username }, process.env.SECRET_KEY as Secret, {expiresIn: "1d"});
            const refreshToken = jwt.sign({ username }, process.env.REFRESH_TOKEN as Secret, {expiresIn: "7d"});
            res.json({accessToken : token, refreshToken : refreshToken});
        }else{
            res.status(403).json({ message: "Invalid credentials" });
        }
    }catch(err){
        console.log(err);
        res.status(400).send(err);
    }
});

router.post("/register", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = new UserModel(username,password);

    try{
        const registration = await saveUserService(user);
        res.status(201).json(registration);
    }catch(err){
        console.log(err);
        res.status(401).json(err);
    }
});

router.post("/refresh-token", async (req, res) => {
    const authHeader = req.headers.authorization;
    const refresh_token = authHeader?.split(' ')[1];

    if(!refresh_token)res.status(401).send('No token provided');

    try{
        const payload = jwt.verify(refresh_token as string, process.env.REFRESH_TOKEN as Secret) as {username: string, iat: number};
        const token = jwt.sign({ username: payload.username }, process.env.SECRET_KEY as Secret, {expiresIn: "7d"});
        res.json({accessToken : token});
    }catch(err){
        console.log(err);
        res.status(401).json(err);
    }
});

export default router;