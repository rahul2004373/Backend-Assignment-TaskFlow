import express, { type Express, type Request, type Response } from 'express';
import dotenv from "dotenv"
import morgan from "morgan"
import { errorHandler } from './lib/error.ts';
import authRoutes from './routes/auth.routes.ts';
import orgRoutes from './routes/org.routes.ts';
import projectRoutes from './routes/project.routes.ts';
import taskRoutes from './routes/task.routes.ts';
import jobRoutes from './routes/job.routes.ts';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

dotenv.config();

const PORT = process.env.PORT;
const app: Express = express();


// middleware
app.use(express.json())
app.use(morgan("dev"))

app.get("/api/health", (req: Request, res: Response) => {
    return res.json({
        "message": "server healthy",
        "data": {
            "cpuUsage": process.cpuUsage(),
            "uptime": process.uptime(),
            "memoryUsage": process.memoryUsage()
        }
    })
})

app.use('/v1/api/auth', authRoutes);
app.use('/v1/api/organizations', orgRoutes);
app.use('/v1/api/projects', projectRoutes);
app.use('/v1/api/tasks', taskRoutes);
app.use('/v1/api/jobs', jobRoutes);

const swaggerDocument = YAML.load(path.join(process.cwd(), 'openapi.yaml'));
app.use('/api-docs', swaggerUi.serve);
app.use('/api-docs', swaggerUi.setup(swaggerDocument));

app.use(errorHandler)

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server listening on => http://localhost:${PORT}`)
    })
}

export default app;