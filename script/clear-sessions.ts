import { db } from '../server/db.js';
import { sessions } from '../shared/models/auth.js';

async function clearSessions() {
  try {
    console.log('Clearing all sessions...');
    await db.delete(sessions);
    console.log('✅ All sessions cleared successfully!');
    console.log('Please clear your browser cookies and try logging in again.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing sessions:', error);
    process.exit(1);
  }
}

clearSessions();
