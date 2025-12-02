import express from 'express';
import User from '../models/user.js';

export async function GetAll(req, res)
{
  const users = await User.find({}).select('name');
  return res.status(200).json({
      success: true,
      data: users
    });
}