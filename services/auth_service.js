import { UsersModel } from '../models/user.js';

const login = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  try {
    const user = await UsersModel.findOne({ email, password });
    return user;
  } catch (error) {
    console.error('Error during login:', error);
    throw new Error('Login failed.');
  }
};

const register = async (user) => {
  if (!user.email || !user.password || !user.firstName || !user.lastName) {
    throw new Error('All fields are required.');
  }

  try {

    const exists = await userExists(user.email)
    if (exists) return null;

    const newUser = new UsersModel(user);
    await newUser.save();
    console.log('User registered successfully:', newUser);

    return newUser;

  } catch (error) {
    console.error('Error during registration:', error);
    throw new Error('Registration failed.');
  }
};


const userExists = async (email) => {
  const existingUser = await UsersModel.findOne({ email });
  return existingUser;
}

export default {
  login,
  register
};
