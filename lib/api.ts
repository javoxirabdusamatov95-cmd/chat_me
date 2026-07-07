import type {
	LoginRequest,
	RegisterRequest,
	TokenResponse,
	UserResponse,
	UserUpdate,
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
