import { create } from 'zustand'
import { groupsApi, messagesApi } from '@/lib/api'
import type { GroupResponse, MessageResponse } from '@/types'

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
    sendMessage: (groupId: number, content: string) => Promise<void>
    deleteMessage: (groupId: number, messageId: number) => Promise<void>
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
                const last = res.messages[res.messages.length - 1].id
                set(s => ({
                    messages: {
                        ...s.messages,
                        [groupId]: [...(s.messages[groupId] ?? []), ...res.messages],
                    },
                    lastMessageId: { ...s.lastMessageId, [groupId]: last },
                }))
            }
        } catch {
            // silent — polling xatosi critical emas
        }
    },

    sendMessage: async (groupId, content) => {
        set({ isSending: true })
        try {
            const msg = await messagesApi.send(groupId, { content })
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

    deleteMessage: async (groupId, messageId) => {
        await messagesApi.delete(groupId, messageId)
        set(s => ({
            messages: {
                ...s.messages,
                [groupId]: (s.messages[groupId] ?? []).filter(m => m.id !== messageId),
            },
        }))
    },
}))
