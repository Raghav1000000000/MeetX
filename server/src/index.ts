import 'dotenv/config';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import cors from 'cors';
import express from 'express';
import { z } from 'zod';
import { chats, meetups, messages, offers, reports, requests, users } from './data.js';

const app = express();
app.use(cors());
app.use(express.json());

const authSchema = z.object({ meetxId: z.string().trim().min(1), name: z.string().trim().min(2) });
const signupSchema = z.object({ accountName: z.string().trim().min(3).max(24).regex(/^[a-zA-Z0-9_]+$/), name: z.string().trim().min(2).max(80), email: z.string().trim().email(), password: z.string().min(8).max(100) });
const loginSchema = z.object({ accountName: z.string().trim().min(1), password: z.string().min(1) });
const requestSchema = z.object({ from: z.string(), to: z.string(), message: z.string().max(240).default('') });
const messageSchema = z.object({ sender: z.string(), body: z.string().trim().min(1).max(1000) });
const userById = (id: string) => users.find((user) => user.meetxId === id);
const userByAccount = (accountName: string) => users.find((user) => user.accountName?.toLowerCase() === accountName.toLowerCase());
const hashPassword = (password: string) => { const salt = randomBytes(16).toString('hex'); return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`; };
const verifyPassword = (password: string, stored: string) => { if (stored.startsWith('demo:')) return stored === `demo:${password}`; const [salt, hash] = stored.split(':'); if (!salt || !hash) return false; const expected = scryptSync(password, salt, 64); return timingSafeEqual(expected, Buffer.from(hash, 'hex')); };
const publicUser = (user: typeof users[number]) => { const { passwordHash: _passwordHash, ...safeUser } = user as typeof user & { passwordHash?: string }; return safeUser; };

app.get('/', (_req, res) => res.send('MeetX API is running. Open the app at http://localhost:5173'));
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'meetx-api' }));
app.post('/api/auth/signup', (req, res) => { const result = signupSchema.safeParse(req.body); if (!result.success) return res.status(400).json({ error: 'Use a valid account name, email, name, and password of at least 8 characters.' }); if (userByAccount(result.data.accountName)) return res.status(409).json({ error: 'That account name is already taken.' }); if (users.some((user) => user.email?.toLowerCase() === result.data.email.toLowerCase())) return res.status(409).json({ error: 'That email is already registered.' }); const nextNumber = users.length + 1; const user = { meetxId: `MX-${String(nextNumber).padStart(4, '0')}`, accountName: result.data.accountName, email: result.data.email, passwordHash: hashPassword(result.data.password), name: result.data.name, age: 25, role: 'MeetX member', city: 'Bengaluru', distance: '0.4 km', photo: 'https://i.pravatar.cc/600?img=68', professionalBio: 'New to MeetX and open to interesting conversations.', casualBio: 'Looking to meet interesting people nearby.', skills: [], interests: [], workingOn: 'Something interesting', lookingFor: 'Good conversations', availability: 'Flexible', liveProfessional: true, liveSocial: true, status: 'active' as const }; users.push(user); return res.status(201).json({ user: publicUser(user), token: `demo-${user.meetxId}` }); });
app.post('/api/auth/login', (req, res) => { const result = loginSchema.safeParse(req.body); if (!result.success) return res.status(400).json({ error: 'Account name and password are required.' }); const user = userByAccount(result.data.accountName); if (!user || !user.passwordHash || !verifyPassword(result.data.password, user.passwordHash)) return res.status(401).json({ error: 'Incorrect account name or password.' }); return res.json({ user: publicUser(user), token: `demo-${user.meetxId}` }); });
app.post('/api/auth/demo', (req, res) => {
  const result = authSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: 'MeetX ID and name are required' });
  const meetxId = result.data.meetxId.toUpperCase();
  let user = userById(meetxId);
  if (!user) {
    user = { meetxId, accountName: `demo-${meetxId.toLowerCase()}`, name: result.data.name, age: 25, role: 'MeetX member', city: 'Bengaluru', distance: '0.4 km', photo: 'https://i.pravatar.cc/600?img=68', professionalBio: 'New to MeetX and open to interesting conversations.', casualBio: 'Looking to meet interesting people nearby.', skills: [], interests: [], workingOn: 'Something interesting', lookingFor: 'Good conversations', availability: 'Flexible', liveProfessional: true, liveSocial: true, status: 'active' };
    users.push(user);
  }
  return res.json({ user: publicUser(user), token: `demo-${user.meetxId}` });
});
app.get('/api/discover', (req, res) => {
  const mode = req.query.mode === 'social' ? 'social' : 'professional';
  const current = String(req.query.userId || 'MX-0001');
  const seen = new Set(requests.filter((request) => request.from === current).map((request) => request.to));
  res.json(users.filter((user) => user.meetxId !== current && user.status === 'active' && !seen.has(user.meetxId) && (mode === 'professional' ? user.liveProfessional : user.liveSocial)).map((user) => ({ ...user, mode })));
});
app.get('/api/users', (_req, res) => res.json(users));
app.get('/api/users/:id', (req, res) => { const user = userById(req.params.id); return user ? res.json(user) : res.status(404).json({ error: 'User not found' }); });
app.get('/api/requests', (req, res) => res.json(requests.filter((request) => request.to === req.query.userId || request.from === req.query.userId)));
app.post('/api/requests', (req, res) => {
  const result = requestSchema.safeParse(req.body);
  if (!result.success || result.data.from === result.data.to) return res.status(400).json({ error: 'Invalid request' });
  if (requests.some((request) => request.from === result.data.from && request.to === result.data.to && request.status === 'pending')) return res.status(409).json({ error: 'Request already sent' });
  const request = { id: `req-${requests.length + 1}`, ...result.data, status: 'pending' as const, createdAt: new Date().toISOString() };
  requests.push(request); return res.status(201).json(request);
});
app.patch('/api/requests/:id', (req, res) => { const request = requests.find((item) => item.id === req.params.id); if (!request) return res.status(404).json({ error: 'Request not found' }); request.status = req.body.status === 'accepted' ? 'accepted' : 'declined'; return res.json(request); });
app.get('/api/chats', (_req, res) => res.json(chats));
app.get('/api/chats/:id/messages', (req, res) => res.json(messages.filter((message) => message.chatId === req.params.id)));
app.post('/api/chats/:id/messages', (req, res) => { const result = messageSchema.safeParse(req.body); if (!result.success) return res.status(400).json({ error: 'Message cannot be empty' }); const message = { id: `message-${messages.length + 1}`, chatId: req.params.id, ...result.data, createdAt: new Date().toISOString() }; messages.push(message); const chat = chats.find((item) => item.id === req.params.id); if (chat) chat.lastMessage = message.body; return res.status(201).json(message); });
app.patch('/api/users/:id', (req, res) => { const user = userById(req.params.id); if (!user) return res.status(404).json({ error: 'User not found' }); if (typeof req.body.name === 'string' && req.body.name.trim()) user.name = req.body.name.trim(); if (typeof req.body.availability === 'string') user.availability = req.body.availability; if (typeof req.body.professionalBio === 'string') user.professionalBio = req.body.professionalBio; if (typeof req.body.workingOn === 'string') user.workingOn = req.body.workingOn; if (typeof req.body.lookingFor === 'string') user.lookingFor = req.body.lookingFor; if (Array.isArray(req.body.skills)) user.skills = req.body.skills.filter((skill: unknown): skill is string => typeof skill === 'string').slice(0, 20); if (typeof req.body.casualBio === 'string') user.casualBio = req.body.casualBio; if (Array.isArray(req.body.interests)) user.interests = req.body.interests.filter((interest: unknown): interest is string => typeof interest === 'string').slice(0, 20); if (req.body.visibility && typeof req.body.visibility === 'object') user.visibility = { professional: Boolean(req.body.visibility.professional), social: Boolean(req.body.visibility.social), distance: Boolean(req.body.visibility.distance), availability: Boolean(req.body.visibility.availability) }; return res.json(user); });
app.get('/api/meetups', (_req, res) => res.json(meetups));
app.post('/api/meetups/:id/join', (req, res) => { const meetup = meetups.find((item) => item.id === req.params.id); if (!meetup) return res.status(404).json({ error: 'Meetup not found' }); if (meetup.attendees >= meetup.capacity) return res.status(409).json({ error: 'Meetup is full' }); meetup.attendees += 1; return res.json(meetup); });
app.post('/api/meetups/:id/leave', (req, res) => { const meetup = meetups.find((item) => item.id === req.params.id); if (!meetup) return res.status(404).json({ error: 'Meetup not found' }); meetup.attendees = Math.max(0, meetup.attendees - 1); return res.json(meetup); });
app.get('/api/offers', (_req, res) => res.json(offers));
app.post('/api/offers/:id/use', (req, res) => { const offer = offers.find((item) => item.id === req.params.id); if (!offer) return res.status(404).json({ error: 'Offer not found' }); offer.used = true; return res.json(offer); });
app.get('/api/reports', (_req, res) => res.json(reports));
app.patch('/api/reports/:id', (req, res) => { const report = reports.find((item) => item.id === req.params.id); if (!report) return res.status(404).json({ error: 'Report not found' }); report.status = req.body.status === 'dismissed' ? 'dismissed' : 'reviewed'; return res.json(report); });
app.post('/api/meetups', (req, res) => { const meetup = { id: `meet-${meetups.length + 1}`, attendees: 0, capacity: Number(req.body.capacity || 20), title: String(req.body.title || 'New MeetX meetup'), purpose: String(req.body.purpose || 'Community'), location: String(req.body.location || 'Bengaluru'), date: String(req.body.date || 'To be announced'), host: 'MeetX Admin' }; meetups.push(meetup); return res.status(201).json(meetup); });
app.delete('/api/meetups/:id', (req, res) => { const index = meetups.findIndex((item) => item.id === req.params.id); if (index < 0) return res.status(404).json({ error: 'Meetup not found' }); meetups.splice(index, 1); return res.status(204).send(); });
app.post('/api/offers', (req, res) => { const offer = { id: `offer-${offers.length + 1}`, business: String(req.body.business || 'Local business'), category: String(req.body.category || 'Community'), title: String(req.body.title || 'New offer'), details: String(req.body.details || 'MeetX member offer'), distance: String(req.body.distance || '0.5 km') }; offers.push(offer); return res.status(201).json(offer); });
app.delete('/api/offers/:id', (req, res) => { const index = offers.findIndex((item) => item.id === req.params.id); if (index < 0) return res.status(404).json({ error: 'Offer not found' }); offers.splice(index, 1); return res.status(204).send(); });
app.get('/api/admin/overview', (_req, res) => res.json({ users: users.length, activeToday: users.filter((user) => user.status === 'active').length, connections: 42, pendingRequests: requests.filter((request) => request.status === 'pending').length, activeMeetups: meetups.length, reports: reports.filter((report) => report.status === 'open').length }));

const port = Number(process.env.PORT || 4000);
const server = app.listen(port, () => console.log(`MeetX API listening on http://localhost:${port}`));
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.warn(`MeetX API is already running on port ${port}; reusing the existing process.`);
    process.exit(0);
  }
  throw error;
});
