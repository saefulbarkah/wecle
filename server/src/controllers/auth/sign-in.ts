import { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import User from '../../models/user.js';
import { createToken } from '../../lib/jwt.js';
import errorhandling from '../../lib/error-handling.js';
import { z } from 'zod';
import { NotFoundError, ValidationError } from '../../errors/index.js';
import { ApiResponse } from '../../types/index.js';

type Tuser = {
  email: string;
  password: string;
};

const loginSchema = z
  .object({
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),
  })
  .required();

const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body as Tuser;

  try {
    // parse schema
    loginSchema.parse({ email, password });

    // check if any user
    const user = await User.findOne({ email: email });
    if (!user) throw new NotFoundError('Invalid Credentials');

    // validation password
    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      throw new ValidationError('Email or password incorrect');
    }

    // create token
    const tokenStore = {
      id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    };
    const token = createToken(tokenStore);
    const response: ApiResponse = {
      status: 200,
      message: 'Welcome back, ' + user.name + '!',
      response: 'success',
      data: { token },
    };
    res.cookie('auth', token, {
      secure: true,
      httpOnly: true,
      maxAge: 51251516 * 1000,
      sameSite: 'none',
    });
    res.status(response.status).json(response);
  } catch (error) {
    errorhandling(error as Error, res);
  }
};

export default signIn;
