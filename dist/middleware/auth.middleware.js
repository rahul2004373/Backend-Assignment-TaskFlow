import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.ts';
const secretKey = process.env.SECRET_KEY || 'default-secret-key';
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
        }
        const token = authHeader.split(' ')[1];
        // Verify JWT
        const decoded = jwt.verify(token, secretKey);
        // Verify user exists in db
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }
        req.user = { id: user.id, email: user.email };
        // Check for org context
        const orgId = req.headers['x-org-id'];
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
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Unauthorized: Token expired' });
        }
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
//# sourceMappingURL=auth.middleware.js.map