import CDP from 'chrome-remote-interface';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const data = JSON.parse(fs.readFileSync(join(__dirname, 'lib/pawns-plus-data.json'), 'utf8'));

CDP(async (client) => {
  const { Page, Runtime } = client;

  await Page.enable();
  await Runtime.enable();

  await Page.navigate({ url: 'http://localhost:3001/dashboard' });
  await Page.loadEventFired();

  const script = `
    localStorage.setItem('erasor_users', ${JSON.stringify(JSON.stringify(data.users))});
    localStorage.setItem('erasor_teams', ${JSON.stringify(JSON.stringify(data.teams))});
    localStorage.setItem('erasor_files', ${JSON.stringify(JSON.stringify(data.files))});
    localStorage.setItem('erasor_current_user', ${JSON.stringify(JSON.stringify(data.currentUser))});
    localStorage.setItem('erasor_current_team', ${JSON.stringify(JSON.stringify(data.currentTeam))});
    localStorage.setItem('pawns_plus_loaded', 'true');
    location.reload();
  `;

  await Runtime.evaluate({ expression: script });

  console.log('✅ Visualizations loaded successfully!');

  await client.close();
}).on('error', (err) => {
  console.error('Error:', err);
});
