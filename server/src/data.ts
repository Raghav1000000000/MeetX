import type { Chat, MeetRequest, Meetup, Offer, User } from '@meetx/shared';

export const users: User[] = [
  { meetxId: 'MX-0001', dbIndexKey: 'MX-YR-0000', accountName: 'raghav', email: 'raghav@meetx.local', passwordHash: 'demo:password', name: 'Raghav Mittal', age: 28, role: 'Founder', city: 'Bengaluru', distance: '0.2 km', photo: 'https://i.pravatar.cc/600?img=12', professionalBio: 'Building MeetX for better local connections.', casualBio: 'Always up for a walk and a sharp conversation.', skills: ['Product', 'Startups', 'Strategy'], interests: ['Coffee', 'Design', 'Cycling'], workingOn: 'MeetX', lookingFor: 'Builders and thoughtful collaborators', availability: 'Weekday evenings', liveProfessional: true, liveSocial: true, status: 'active', isAdmin: true },
  { meetxId: 'MX-YR-0002', accountName: 'yashraj', email: 'yash@meetx.local', passwordHash: 'demo:password', name: 'Yash Raj', age: 26, role: 'Product Designer', city: 'Bengaluru', distance: '0.5 km', photo: 'https://i.pravatar.cc/600?img=11', professionalBio: 'Designing consumer products and looking to meet people working on interesting ideas.', casualBio: 'Design, long walks, and finding the best filter coffee in town.', skills: ['Product Design', 'UX', 'Figma'], interests: ['Startups', 'Coffee', 'Design'], workingOn: 'A calmer way to discover local communities', lookingFor: 'Interesting ideas and generous people', availability: 'Today, 6:00 PM', liveProfessional: true, liveSocial: false, status: 'active' },
  { meetxId: 'MX-0006', accountName: 'meetxtest', email: 'meetxtest@example.com', passwordHash: 'demo:MeetXtest123', name: 'MeetX Test User', age: 25, role: 'MeetX member', city: 'Bengaluru', distance: '0.4 km', photo: 'https://i.pravatar.cc/600?img=68', professionalBio: 'Testing the MeetX professional discovery flow.', casualBio: 'Testing local social discovery and conversations.', skills: ['Testing', 'Product'], interests: ['Coffee', 'Design'], workingOn: 'MeetX test flows', lookingFor: 'Good product feedback', availability: 'Flexible', liveProfessional: true, liveSocial: true, status: 'active' },
  { meetxId: 'MX-0003', name: 'Meera Iyer', age: 29, role: 'Growth Lead', city: 'Bengaluru', distance: '0.8 km', photo: 'https://i.pravatar.cc/600?img=47', professionalBio: 'Helping early teams find their first hundred customers.', casualBio: 'Bookstores, pilates, and Sunday brunches.', skills: ['Growth', 'Community', 'Research'], interests: ['Books', 'Food', 'Wellness'], workingOn: 'A community-led marketplace', lookingFor: 'Curious founders and operators', availability: 'Tomorrow morning', liveProfessional: false, liveSocial: true, status: 'active' },
  { meetxId: 'MX-0004', name: 'Kabir Nair', age: 31, role: 'Software Engineer', city: 'Bengaluru', distance: '1.2 km', photo: 'https://i.pravatar.cc/600?img=33', professionalBio: 'Building reliable systems for teams moving quickly.', casualBio: 'Cycling around the city and collecting vinyl.', skills: ['TypeScript', 'APIs', 'Systems'], interests: ['Cycling', 'Music', 'Food'], workingOn: 'A developer tools startup', lookingFor: 'Designers who love shipping', availability: 'This weekend', liveProfessional: true, liveSocial: false, status: 'active' },
  { meetxId: 'MX-0005', name: 'Ananya Rao', age: 25, role: 'Illustrator', city: 'Bengaluru', distance: '1.6 km', photo: 'https://i.pravatar.cc/600?img=32', professionalBio: 'Visual storyteller working across brands and culture.', casualBio: 'Gallery afternoons and trying new recipes.', skills: ['Illustration', 'Branding', 'Art Direction'], interests: ['Art', 'Cooking', 'Travel'], workingOn: 'An independent print journal', lookingFor: 'Creative people nearby', availability: 'Today, 7:30 PM', liveProfessional: false, liveSocial: true, status: 'active' }
];

export const requests: MeetRequest[] = [
  { id: 'req-1', from: 'MX-0003', to: 'MX-0001', message: 'Would love to hear what you are building.', status: 'pending', createdAt: new Date().toISOString() }
];

export const meetups: Meetup[] = [
  { id: 'meet-1', title: 'Sunday morning ride', purpose: 'Cycling', location: 'Cubbon Park gate', date: 'Sun, 6:30 AM', host: 'Kabir Nair', attendees: 14, capacity: 20 },
  { id: 'meet-2', title: 'Small teams, big ideas', purpose: 'Founders', location: 'The Courtyard Cafe', date: 'Thu, 7:00 PM', host: 'Raghav Mittal', attendees: 8, capacity: 12 }
];

export const offers: Offer[] = [
  { id: 'offer-1', business: 'Third Wave Coffee', category: 'Coffee', title: 'Free pastry with any coffee', details: 'Show this offer at the counter. One per person.', distance: '0.4 km' },
  { id: 'offer-2', business: 'The Green Pantry', category: 'Food', title: '10% off weekends', details: 'Valid for MeetX members every Saturday and Sunday.', distance: '0.9 km' }
];

export const chats: Chat[] = [
  { id: 'chat-1', participant: 'MX-0003', temporary: false, lastMessage: 'See you at the cafe tomorrow.' },
  { id: 'chat-2', participant: 'MX-0002', temporary: true, expiresAt: new Date(Date.now() + 86400000).toISOString(), lastMessage: 'What are you working on lately?' }
];

export const messages = [
  { id: 'message-1', chatId: 'chat-1', sender: 'MX-0003', body: 'See you at the cafe tomorrow.', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'message-2', chatId: 'chat-2', sender: 'MX-0002', body: 'What are you working on lately?', createdAt: new Date(Date.now() - 7200000).toISOString() }
];

export const reports = [
  { id: 'report-1', user: 'MX-0005', reason: 'Fake profile', reportedBy: 'MX-0001', date: new Date().toISOString(), status: 'open' },
  { id: 'report-2', user: 'MX-0004', reason: 'Spam', reportedBy: 'MX-YR-0002', date: new Date().toISOString(), status: 'open' },
  { id: 'report-3', user: 'MX-0003', reason: 'Other', reportedBy: 'MX-0001', date: new Date().toISOString(), status: 'reviewed' }
];
