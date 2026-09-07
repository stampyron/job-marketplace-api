// src/server.ts
import { createApp } from './app';

const PORT = process.env.PORT || 3000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Job Marketplace API running on http://localhost:${PORT}`);
});