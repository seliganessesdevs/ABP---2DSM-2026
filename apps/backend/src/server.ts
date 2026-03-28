import express from 'express';

const app = express()


app.get('/api/v1/health', (req, res) => {
  res.json({success: true});
})

export default app;