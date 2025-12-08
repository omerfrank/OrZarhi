import express from 'express';
import User from '../models/user.js';

export async function GetAllUsers(req, res)
{

  const users = await User.find({}).select('username'); 
  return res.status(200).json({
      success: true,
      data: users
    });
}