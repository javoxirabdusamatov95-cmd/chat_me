import type {
	LoginRequest,
	RegisterRequest,
	TokenResponse,
	UserResponse,
	UserUpdate,
	GroupCreate,
    GroupUpdate,
    GroupResponse,
    GroupDetailResponse,
    GroupMemberResponse,
	MessageCreate,
    MessageListResponse,
    MessageResponse,
	MessageOut,
	InvitationResponse,
    InviteRequest,
} from '@/types'
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
		'ngrok-skip-browser-warning': 'true',
	},
})

// Token interceptor — har bir so'rovga Authorization header qo'shadi
api.interceptors.request.use(config => {
	if (typeof window !== 'undefined') {
		const token = localStorage.getItem('access_token')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
	}
	return config
})

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
	register: (data: RegisterRequest) =>
		api.post<UserResponse>('/auth/register', data).then(r => r.data),
	login: (data: LoginRequest) =>
		api.post<TokenResponse>('/auth/login', data).then(r => r.data),
}

// ─── Users ───────────────────────────────────────────────────────────────────
export const usersApi = {
	// O'z profilimni olish
	getMe: () => api.get<UserResponse>('/users/me').then(r => r.data),
	// Profilni yangilash (bio, avatar URL)
	updateMe: (data: UserUpdate) =>
		api.put<UserResponse>('/users/me', data).then(r => r.data),
	// Username bo'yicha qidirish
	search: (q: string) =>
		api
			.get<UserResponse[]>('/users/search', { params: { q } })
			.then(r => r.data),
	// Username bo'yicha boshqa foydalanuvchini ko'rish
	getByUsername: (username: string) =>
		api.get<UserResponse>(`/users/${username}`).then(r => r.data),
}

export const groupsApi = {
    getMyGroups: () =>
        api.get<GroupResponse[]>('/groups').then(r => r.data),

    create: (data: GroupCreate) =>
        api.post<GroupResponse>('/groups', data).then(r => r.data),

    // "getById" o'rniga "get" — ChatArea.tsx shuni chaqiradi
    get: (groupId: number) =>
        api.get<GroupDetailResponse>(`/groups/${groupId}`).then(r => r.data),

    update: (groupId: number, data: GroupUpdate) =>
        api.put<GroupResponse>(`/groups/${groupId}`, data).then(r => r.data),

    remove: (groupId: number) =>
        api.delete(`/groups/${groupId}`).then(r => r.data),

    getMembers: (groupId: number) =>
        api.get<GroupMemberResponse[]>(`/groups/${groupId}/members`).then(r => r.data),

    removeMember: (groupId: number, userId: number) =>
        api.delete(`/groups/${groupId}/members/${userId}`).then(r => r.data),

    leave: (groupId: number) =>
        api.post(`/groups/${groupId}/leave`).then(r => r.data),

	   invite: (groupId: number, data: InviteRequest) =>
        api.post<MessageOut>(`/groups/${groupId}/invite`, data).then(r => r.data),
}

// ─── Messages ─────────────────────────────────────────────────────────────────
export const messagesApi = {
    // Guruh xabarlarini olish
    // after parametri polling uchun: faqat shu ID dan keyingilarni qaytaradi
    getMessages: (
        groupId: number,
        params?: { limit?: number; offset?: number; after?: number },
    ) =>
        api
            .get<MessageListResponse>(`/groups/${groupId}/messages`, { params })
            .then(r => r.data),

    // Xabar yuborish
    send: (groupId: number, data: MessageCreate) =>
        api
            .post<MessageResponse>(`/groups/${groupId}/messages`, data)
            .then(r => r.data),

    // Xabarni o'chirish (faqat o'z xabari yoki admin)
    delete: (groupId: number, messageId: number) =>
        api
            .delete<MessageOut>(`/groups/${groupId}/messages/${messageId}`)
            .then(r => r.data),
}

   // ─── Invitations ──────────────────────────────────────────────────────────────
export const invitationsApi = {
    // Menga kelgan barcha takliflar (pending, accepted, rejected)
    getMyInvitations: () =>
        api.get<InvitationResponse[]>('/invitations').then(r => r.data),

    // Taklifni qabul qilish — guruhga qo'shiladi
    accept: (id: number) =>
        api.post<MessageOut>(`/invitations/${id}/accept`).then(r => r.data),

    // Taklifni rad etish
    reject: (id: number) =>
        api.post<MessageOut>(`/invitations/${id}/reject`).then(r => r.data),
}