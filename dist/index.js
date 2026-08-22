import express, {} from 'express';
import dotenv from "dotenv";
import morgan from "morgan";
import { z } from "zod";
import bcrypt from 'bcrypt';
import { prisma } from './lib/prisma.ts';
import { errorHandler } from './lib/error.ts';
dotenv.config();
const PORT = process.env.PORT;
const app = express();
const secretkey = process.env.SECRET_KEY;
// middleware
app.use(express.json());
app.use(morgan("dev"));
import authRoutes from './routes/auth.routes.ts';
import orgRoutes from './routes/org.routes.ts';
// health route
app.get("/api/health", (req, res) => {
    return res.json({
        "message": "server healthy",
        "data": {
            "cpuUsage": process.cpuUsage(),
            "uptime": process.uptime(),
            "memoryUsage": process.memoryUsage()
        }
    });
});
app.use('/auth', authRoutes);
app.use('/organizations', orgRoutes);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server listening on => http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map