import jwt, { SignOptions } from 'jsonwebtoken';

export const getAccessToken = (email: string, firstName?: string, lastName?: string , expiry?: string) => {
  const expiresIn = (expiry ?? '6h') as SignOptions['expiresIn'];
  const data = { email, firstName, lastName };

  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined');
  }

  const options: SignOptions = { expiresIn };

  const accessToken = jwt.sign({ data }, process.env.ACCESS_TOKEN_SECRET as string, options);

  return accessToken;
};

export const getRefreshToken = (email: string, firstName?: string, lastName?: string, expiry?: string) => {
  const expiresIn = (expiry ?? '1d') as SignOptions['expiresIn'];
  const data = { email, firstName, lastName };

  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined');
  }

  const options: SignOptions = { expiresIn };

  const refreshToken = jwt.sign({ data }, process.env.ACCESS_TOKEN_SECRET as string, options);

  return refreshToken;
};

