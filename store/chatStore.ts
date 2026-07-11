import { create } from 'zustand'
import { groupsApi, messagesApi } from '@/lib/api'
import type { GroupResponse, MessageResponse } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { playNotificationSound } from '@/lib/notificationSound'

interface ChatState {
    // Guruhlar
    groups: GroupResponse[]
    isLoadingGroups: boolean
    fetchGroups: () => Promise<void>
    addGroup: (group: GroupResponse) => void
    removeGroup: (groupId: number) => void

    // Xabarlar
    messages: Record<number, MessageResponse[]>
    lastMessageId: Record<number, number>
    isLoadingMessages: boolean
    isSending: boolean
    activeGroupId: number | null

    setActiveGroup: (id: number | null) => void
    fetchMessages: (groupId: number) => Promise<void>
    pollMessages: (groupId: number) => Promise<void>
    sendMessage: (groupId: number, content: string, replyToId?: number | null) => Promise<void>
    editMessage: (groupId: number, messageId: number, content: string) => Promise<void>
    deleteMessage: (groupId: number, messageId: number) => Promise<void>
    toggleReaction: (groupId: number, messageId: number, emoji: string) => Promise<void>
}

export const useChatStore = create<ChatState>((set, get) => ({
    groups: [],
    isLoadingGroups: false,

    fetchGroups: async () => {
        set({ isLoadingGroups: true })
        try {
            const groups = await groupsApi.getMyGroups()
            set({ groups, isLoadingGroups: false })
        } catch {
            set({ isLoadingGroups: false })
        }
    },

    addGroup: group => set(s => ({ groups: [group, ...s.groups] })),
    removeGroup: id => set(s => ({ groups: s.groups.filter(g => g.id !== id) })),

    messages: {},
    lastMessageId: {},
    isLoadingMessages: false,
    isSending: false,
    activeGroupId: null,

    setActiveGroup: id => set({ activeGroupId: id }),

    fetchMessages: async groupId => {
        set({ isLoadingMessages: true })
        try {
            const res = await messagesApi.getMessages(groupId, { limit: 50 })
            const msgs = res.messages
            const last = msgs.length > 0 ? msgs[msgs.length - 1].id : 0
            set(s => ({
                messages: { ...s.messages, [groupId]: msgs },
                lastMessageId: { ...s.lastMessageId, [groupId]: last },
                isLoadingMessages: false,
            }))
        } catch {
            set({ isLoadingMessages: false })
        }
    },

pollMessages: async groupId => {
    const after = get().lastMessageId[groupId]
    if (after === undefined) return
    try {
        const res = await messagesApi.getMessages(groupId, { after, limit: 50 })
        if (res.messages.length > 0) {
            const currentUserId = useAuthStore.getState().user?.id

            set(s => {
                const existing = s.messages[groupId] ?? []
                const existingIds = new Set(existing.map(m => m.id))
                const newMsgs = res.messages.filter(m => !existingIds.has(m.id))

                if (newMsgs.length === 0) return s

                // Faqat boshqa foydalanuvchidan kelgan xabar bo'lsa ovoz chiqarish
                const hasOthersMessage = newMsgs.some(
                    m => m.sender_id !== currentUserId,
                )
                if (hasOthersMessage) {
                    playNotificationSound()
                }

                const last = newMsgs[newMsgs.length - 1].id
                return {
                    messages: {
                        ...s.messages,
                        [groupId]: [...existing, ...newMsgs],
                    },
                    lastMessageId: { ...s.lastMessageId, [groupId]: last },
                }
            })
        }
    } catch {
        // silent — polling xatosi critical emas
    }
},

    sendMessage: async (groupId, content, replyToId) => {
        set({ isSending: true })
        try {
            const msg = await messagesApi.send(groupId, {
                content,
                reply_to_id: replyToId ?? null,
            })
            set(s => ({
                messages: {
                    ...s.messages,
                    [groupId]: [...(s.messages[groupId] ?? []), msg],
                },
                lastMessageId: { ...s.lastMessageId, [groupId]: msg.id },
                isSending: false,
            }))
        } catch {
            set({ isSending: false })
            throw new Error('Xabar yuborishda xato')
        }
    },

    editMessage: async (groupId, messageId, content) => {
        const updated = await messagesApi.edit(groupId, messageId, { content })
        set(s => ({
            messages: {
                ...s.messages,
                [groupId]: (s.messages[groupId] ?? []).map(m =>
                    m.id === messageId ? updated : m,
                ),
            },
        }))
    },

    deleteMessage: async (groupId, messageId) => {
        await messagesApi.delete(groupId, messageId)
        set(s => ({
            messages: {
                ...s.messages,
                [groupId]: (s.messages[groupId] ?? []).filter(m => m.id !== messageId),
            },
        }))
    },

    toggleReaction: async (groupId, messageId, emoji) => {
        const reactions = await messagesApi.toggleReaction(groupId, messageId, { emoji })
        set(s => ({
            messages: {
                ...s.messages,
                [groupId]: (s.messages[groupId] ?? []).map(m =>
                    m.id === messageId ? { ...m, reactions } : m,
                ),
            },
        }))
    },
}))
