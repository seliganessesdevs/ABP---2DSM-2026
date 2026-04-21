import express, { type Express } from 'express';

const app: Express = express();

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true });
});

export default app;