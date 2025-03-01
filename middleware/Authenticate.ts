import jwt, {Secret} from 'jsonwebtoken';
import express from "express";

export function authenticateToken(req : express.Request, res : express.Response, next : express.NextFunction){
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    console.log("Enter asdsad")
    if(!token)res.status(401).send('No token provided');

    try{
        console.log("Enter asdsad   1",authHeader)
        const payload = jwt.verify(token as string, process.env.SECRET_KEY as Secret) as {username: string, iat: number};
        req.body.username = payload.username;
        console.log("Enter asdsad   2   ")
        next();
    }catch(err){
        res.status(401).send(err);
    }
}