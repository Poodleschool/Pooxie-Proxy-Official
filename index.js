import express from 'express';
import http from 'node:http';
import createBareServer from "educational-br-sr";
import path from 'node:path';
import cors from 'cors';

const __dirname = process.cwd();
const server = http.createServer();
const app = express(server);
const bareServer = createBareServer('/outerspace/');
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'static')));

const routes = [
  { path: '/', file: 'index.html' },
  { path: '/news', file: 'apps.html' },
  { path: '/events', file: 'games.html' },
  { path: '/diagnostic', file: 'settings.html' },
  { path: '/local-news', file: 'tabs.html' },
  { path: '/image-galleries', file: 'go.html' },
  { path: '/student/login/--farmer--ross', file: '/dev/index.html' },
  { path: '/student/cdn/--farmer--hess', file: 'legacyV4.png' },
  { path: '/loggedireferalcodeihyg1324/', file: 'authindex.html' },
  { path: '/parent/webv3.5/dir/var/bin/temp4/privacy.v12.3/cap.access=9096', file: 'privacy.md' },
  { path: '/parent/webv3.5/dir/var/bin/temp4/terms.v12.3/cap.access=9096', file: 'terms.md' },
];

app.get('/edu/*', cors({ origin: false }), async (req, res, next) => {
  try {
    const reqTarget = `https://raw.githubusercontent.com/InterstellarNetwork/Interstellar-Assets/main/${req.params[0]}`;
    const asset = await fetch(reqTarget);
    
    if (asset.ok) {
      const data = await asset.arrayBuffer();
      res.end(Buffer.from(data));
    } else {
      next();
    }
  } catch (error) {
    console.error('Error fetching:', error);
    next(error);
  }
});

routes.forEach((route) => {
  app.get(route.path, (req, res) => {
    res.sendFile(path.join(__dirname, 'static', route.file));
  });
});

server.on('request', (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on('upgrade', (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.on('listening', () => {
  console.log(`Running at http://localhost:${PORT}`);
});

server.listen({
  port: PORT,
});
