export type DiscoveryMode = 'professional' | 'social';
export type RequestStatus = 'pending' | 'accepted' | 'declined';

export interface User {
  meetxId: string;
  dbIndexKey?: string;
  accountName?: string;
  email?: string;
  passwordHash?: string;
  name: string;
  age: number;
  role: string;
  city: string;
  distance: string;
  photo: string;
  professionalBio: string;
  casualBio: string;
  skills: string[];
  interests: string[];
  workingOn: string;
  lookingFor: string;
  availability: string;
  liveProfessional: boolean;
  liveSocial: boolean;
  visibility?: { professional: boolean; social: boolean; distance: boolean; availability: boolean };
  status: 'active' | 'suspended';
  isAdmin?: boolean;
}

export interface MeetRequest {
  id: string;
  from: string;
  to: string;
  message: string;
  status: RequestStatus;
  createdAt: string;
}

export interface Meetup { id: string; title: string; purpose: string; location: string; date: string; host: string; attendees: number; capacity: number; }
export interface Offer { id: string; business: string; category: string; title: string; details: string; distance: string; used?: boolean; }
export interface Chat { id: string; participant: string; expiresAt?: string; temporary: boolean; lastMessage: string; }
