import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.ts';

const secretKey: string = process.env.SECRET_KEY || 'default-secret-key';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
  orgContext?: {
    org_id: string;
    role: string;
  };
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    const decoded = jwt.verify(token, secretKey as string) as jwt.JwtPayload;
    if (!decoded || typeof decoded !== 'object' || !decoded.id) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token payload' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id as string },
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    req.user = { id: user.id, email: user.email };

    const orgId = req.headers['x-org-id'] as string;
    if (orgId) {
      const membership = await prisma.orgMember.findUnique({
        where: {
          user_id_organization_id: {
            user_id: user.id,
            organization_id: orgId,
          },
        },
      });

      if (!membership) {
        return res.status(403).json({ error: 'Forbidden: You do not have access to this organization' });
      }

      req.orgContext = {
        org_id: orgId,
        role: membership.role,
      };
    }

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Unauthorized: Token expired' });
    }
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
