// auth controller
import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import { Vlogin, Vregister } from '../validations/auth.schema.js';
export async function register(req, res) {
    // res.send('register works?');
    try {
        
        const parsed = Vregister.safeParse(req.body);
        if (!parsed.success) {
            const issues = parsed.error.issues || [];
            const errorMsg = issues[0]?.message || 'Validation failed';
            
            return res.status(400).json({ success: false, error: errorMsg });
        }
        const {name,email,password} = req.body;
        

        const emailExist = await User.findOne({email});
        if (emailExist){
            return res.status(409).json({success:false, error:'user already exist'})

        }
        console.log("got details");
        let passwordhash;
        passwordhash = await bcrypt.hash(password, 10);        
        console.log("hashed, " );
        
        
        const user = await User.create({name,email,password:passwordhash});
        if (!user){
            return res.status(404).json({success:false, error:'user not found? '})
        }
        return res.status(201).json({success:true,message:'user created'})
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({success:false, error:'internal server error'});

    }
    
}
export async function login(req, res) {
    // res.send('login works?');
    try {
        
        
        const parsed = Vlogin.safeParse(req.body);
        if (!parsed.success) {
            const issues = parsed.error.issues || [];
            const errorMsg = issues[0]?.message || 'Validation failed';
            
            return res.status(400).json({ success: false, error: errorMsg });
        }
        const {email,password} = req.body;
        
        const UserPtr = await User.findOne({email});
        if (!UserPtr){
            return res.status(401 ).json({success:false, error:'incorrect'})

        }
        bcrypt.compare(password, UserPtr.password, (err, result) => {
                if (err) {
                    // Handle error
                    console.error('Error comparing passwords:', err);
                    return;
                }
                if (result) {
                    // Passwords match, authentication successful
                    return res.status(200).json({success:true,message:'login true'})
                } else {
                    // Passwords don't match, authentication failed
                    return res.status(401 ).json({success:false, error:'incorrect'})

                }
        })             
    } catch (error) {
        console.error(error);
        return res.status(500).json({success:false, error:'internal error '});

    }
}