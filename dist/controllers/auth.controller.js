import { authService } from '../services/auth.service.ts';
export const authController = {
    async register(req, res, next) {
        try {
            const user = await authService.register(req.body);
            return res.status(201).json({ message: 'User registered successfully', data: user });
        }
        catch (error) {
            if (error.message === 'Email is already in use') {
                return res.status(409).json({ error: error.message });
            }
            next(error);
        }
    },
    async login(req, res, next) {
        try {
            const tokens = await authService.login(req.body);
            return res.status(200).json({ message: 'Login successful', data: tokens });
        }
        catch (error) {
            if (error.message === 'Invalid email or password') {
                return res.status(401).json({ error: error.message });
            }
            next(error);
        }
    },
    async refresh(req, res, next) {
        try {
            const tokens = await authService.refresh(req.body);
            return res.status(200).json({ message: 'Tokens refreshed successfully', data: tokens });
        }
        catch (error) {
            return res.status(401).json({ error: error.message || 'Unauthorized' });
        }
    },
    async logout(req, res, next) {
        try {
            await authService.logout(req.body);
            return res.status(200).json({ message: 'Logged out successfully' });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=auth.controller.js.map