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

    const exists = await getUser(user.email)
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


const getUser = async (email) => {
  const existingUser = await UsersModel.findOne({ email });
  return existingUser;
}

const update = async (user) => {
  if (!user.email || !user.firstName || !user.lastName || !user.currentPassword || !user.newPassword) {
    throw new Error('All fields are required.');
  }

  try {
    // Check if user exists by email
    const existingUser = await getUser(user.email);
    if (!existingUser) return null;

    // Verify current password
    const isMatch = user.currentPassword === existingUser.password;
    if (!isMatch) {
      throw new Error('Current password is incorrect.');
    }

    // Update user details
    existingUser.firstName = user.firstName;
    existingUser.lastName = user.lastName;
    existingUser.password = user.newPassword;
    if (user.newEmail)
      existingUser.email = user.newEmail;

    if (user.orders)
      existingUser.orders = user.orders;

    // Save the updated user
    await existingUser.save();
    console.log('User updated successfully:', existingUser);

    return existingUser;

  } catch (error) {
    console.error('Error during update:', error);
    throw new Error(error.message);
  }
};

const updateUserOrders = async (user, orders) => {
  try {
    user.orders = orders;
    await user.save();

  } catch (e) {
    console.error('Error updating user orders..', e);
    throw new Error(error.message);
  }
}

const findUserWhoOrderedSpecificOrder = async (email, orderId) => {
  try {
    const user = await Users.findOne({ email, orders: orderId });
    return user;
  } catch (error) {
    console.error('Error finding user:', error);
    throw error; // Re-throw the error after logging it
  }
};


export default {
  login,
  register,
  update,
  getUser,
  updateUserOrders,
  findUserWhoOrderedSpecificOrder
};
