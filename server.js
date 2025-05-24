import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import history from 'connect-history-api-fallback';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create express instance
const app = express();

// Enable history API fallback for Vue Router
app.use(history());

// Serve static files from the dist directory
const staticDir = path.join(__dirname, 'dist');
app.use(express.static(staticDir));

// Set port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Serving files from: ${staticDir}`);
});