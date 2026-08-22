import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repository/user.repository.ts';
import { authRepository } from '../repository/auth.repository.ts';
import type { RegisterInput, LoginInput, RefreshInput } from '../schema/auth.schema.ts';

const secretKey = process.env.SECRET_KEY || 'default-secret-key';
const accessExpiration = '15m';

export const authService = {
  async register(data: RegisterInput) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email is already in use');
    }

    const saltRounds = 12;
    const hash_password = await bcrypt.hash(data.password, saltRounds);

    const user = await userRepository.createUser({
      name: data.name,
      email: data.email,
      hash_password,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  },

  async login(data: LoginInput) {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(data.password, user.hash_password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      secretKey,
      { expiresIn: accessExpiration }
    );

    const refreshTokenData = await authRepository.createRefreshToken(user.id);

    return {
      accessToken,
      refreshToken: refreshTokenData.token,
    };
  },

  async refresh(data: RefreshInput) {
    const tokenRecord = await authRepository.findRefreshToken(data.refreshToken);

    if (!tokenRecord) {
      throw new Error('Invalid refresh token');
    }

    if (tokenRecord.revoked) {
      throw new Error('Refresh token has been revoked');
    }

    if (new Date() > tokenRecord.expires_at) {
      throw new Error('Refresh token has expired');
    }

    // Optional: Refresh token rotation
    await authRepository.revokeRefreshToken(tokenRecord.token);
    const newRefreshToken = await authRepository.createRefreshToken(tokenRecord.user_id);

    const accessToken = jwt.sign(
      { id: tokenRecord.user.id, email: tokenRecord.user.email },
      secretKey,
      { expiresIn: accessExpiration }
    );

    return {
      accessToken,
      refreshToken: newRefreshToken.token,
    };
  },

  async logout(data: RefreshInput) {
    await authRepository.revokeRefreshToken(data.refreshToken);
  },
};
