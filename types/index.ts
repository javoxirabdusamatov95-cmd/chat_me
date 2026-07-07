// Auth Types
export interface RegisterRequest {
	username: string
	password: string
}

export interface LoginRequest {
	username: string
	password: string
}

export interface TokenResponse {
	access_token: string
	token_type: string
}

export interface UserResponse {
	id: number
	username: string
	avatar: string | null
	bio: string | null
	created_at: string
}

export interface UserUpdate {
	avatar?: string | null
	bio?: string | null
}

// Group Types
export type RoleEnum = 'admin' | 'member'
export type StatusEnum = 'pending' | 'accepted' | 'rejected'

export interface GroupCreate {
	name: string
	description?: string | null
	avatar?: string | null
}

export interface GroupUpdate {
	name?: string | null
	description?: string | null
	avatar?: string | null
}

export interface GroupResponse {
	id: number
	name: string
	description: string | null
	avatar: string | null
	owner_id: number
	created_at: string
}

export interface GroupDetailResponse extends GroupResponse {
	owner: UserResponse
	member_count: number
}

export interface GroupMemberResponse {
	id: number
	user_id: number
	group_id: number
	role: RoleEnum
	joined_at: string
	user: UserResponse
}

// Message Types
export interface MessageCreate {
	content: string
}

export interface MessageResponse {
	id: number
	group_id: number
	sender_id: number
	content: string
	created_at: string
	sender: UserResponse
}

export interface MessageListResponse {
	messages: MessageResponse[]
	total: number
}

// Invitation Types
export interface InviteRequest {
	username: string
}

export interface InvitationResponse {
	id: number
	group_id: number
	inviter_id: number
	invitee_id: number
	status: StatusEnum
	created_at: string
	group: GroupResponse
	inviter: UserResponse
}

export interface MessageOut {
	message: string
}
