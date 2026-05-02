import app from './app';
import './workers/taskWorker'; // Start the BullMQ worker

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Taskrix Backend running on http://localhost:${PORT}`);
});
