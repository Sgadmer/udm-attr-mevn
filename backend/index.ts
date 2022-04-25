import express, { Router } from 'express';

const app = express();
app.use(express.json());

// Move to server/express-app/routes/test.ts, anywhere really, but avoid server/api and server/middleware
const testRouter = new Router();
testRouter.get('/', (req, res) => res.status(200).json({ route: '/api/test' }));
testRouter.get('/test', (req, res) => res.status(200).json({ route: '/api/test/test' }));

// You **must** add `/api` prefix (same as nuxt.config).
// Maybe you can use global prefix with express, never used it
app.use('/api/test', testRouter);

// Catch-all
app.use((req, res) => res.status(200).json({ route: '/*' }));

export default app;
