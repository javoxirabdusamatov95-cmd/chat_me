import axios from 'axios';
import type {
  RegisterRequest, LoginRequest, TokenResponse, UserResponse, UserUpdate,
  GroupCreate, GroupUpdate, GroupResponse, GroupDetailResponse,
  GroupMemberResponse, MessageCreate, MessageResponse, MessageListResponse,
  InviteRequest, InvitationResponse, MessageOut,
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Token interceptor
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth
export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<UserResponse>('/auth/register', data).then(r => r.data),
  login: (data: LoginRequest) =>
    api.post<TokenResponse>('/auth/login', data).then(r => r.data),
  me: () =>
    api.get<UserResponse>('/auth/me').then(r => r.data),
  logout: () =>
    api.post<MessageOut>('/auth/logout').then(r => r.data),
};

// Users
export const usersApi = {
  search: (q: string) =>
    api.get<UserResponse[]>('/users/search', { params: { q } }).then(r => r.data),
  getMe: () =>
    api.get<UserResponse>('/users/me').then(r => r.data),
  updateMe: (data: UserUpdate) =>
    api.put<UserResponse>('/users/me', data).then(r => r.data),
  getByUsername: (username: string) =>
    api.get<UserResponse>(`/users/${username}`).then(r => r.data),
};

// Groups
export const groupsApi = {
  getMyGroups: () =>
    api.get<GroupResponse[]>('/groups').then(r => r.data),
  create: (data: GroupCreate) =>
    api.post<GroupResponse>('/groups', data).then(r => r.data),
  get: (groupId: number) =>
    api.get<GroupDetailResponse>(`/groups/${groupId}`).then(r => r.data),
  update: (groupId: number, data: GroupUpdate) =>
    api.put<GroupResponse>(`/groups/${groupId}`, data).then(r => r.data),
  delete: (groupId: number) =>
    api.delete<MessageOut>(`/groups/${groupId}`).then(r => r.data),
  getMembers: (groupId: number) =>
    api.get<GroupMemberResponse[]>(`/groups/${groupId}/members`).then(r => r.data),
  leave: (groupId: number) =>
    api.post<MessageOut>(`/groups/${groupId}/leave`).then(r => r.data),
  kickMember: (groupId: number, userId: number) =>
    api.delete<MessageOut>(`/groups/${groupId}/kick/${userId}`).then(r => r.data),
  invite: (groupId: number, data: InviteRequest) =>
    api.post<MessageOut>(`/groups/${groupId}/invite`, data).then(r => r.data),
};

// Messages
export const messagesApi = {
  getMessages: (groupId: number, params?: { limit?: number; offset?: number; after?: number }) =>
    api.get<MessageListResponse>(`/groups/${groupId}/messages`, { params }).then(r => r.data),
  send: (groupId: number, data: MessageCreate) =>
    api.post<MessageResponse>(`/groups/${groupId}/messages`, data).then(r => r.data),
  delete: (groupId: number, messageId: number) =>
    api.delete<MessageOut>(`/groups/${groupId}/messages/${messageId}`).then(r => r.data),
};

// Invitations
export const invitationsApi = {
  getMyInvitations: () =>
    api.get<InvitationResponse[]>('/invitations').then(r => r.data),
  accept: (invitationId: number) =>
    api.post<MessageOut>(`/invitations/${invitationId}/accept`).then(r => r.data),
  reject: (invitationId: number) =>
    api.post<MessageOut>(`/invitations/${invitationId}/reject`).then(r => r.data),
};
