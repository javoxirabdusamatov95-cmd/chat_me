import { create } from 'zustand';
import { groupsApi, messagesApi } from '@/lib/api';
import type { GroupResponse, MessageResponse } from '@/types';

interface ChatState {
  groups: GroupResponse[];
  activeGroupId: number | null;
  messages: Record<number, MessageResponse[]>;
  lastMessageId: Record<number, number>;
  isLoadingGroups: boolean;
  isLoadingMessages: boolean;
  isSending: boolean;

  fetchGroups: () => Promise<void>;
  setActiveGroup: (id: number | null) => void;
  fetchMessages: (groupId: number) => Promise<void>;
  pollMessages: (groupId: number) => Promise<void>;
  sendMessage: (groupId: number, content: string) => Promise<void>;
  deleteMessage: (groupId: number, messageId: number) => Promise<void>;
  addGroup: (group: GroupResponse) => void;
  removeGroup: (groupId: number) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  groups: [],
  activeGroupId: null,
  messages: {},
  lastMessageId: {},
  isLoadingGroups: false,
  isLoadingMessages: false,
  isSending: false,

  fetchGroups: async () => {
    set({ isLoadingGroups: true });
    try {
      const groups = await groupsApi.getMyGroups();
      set({ groups, isLoadingGroups: false });
    } catch {
      set({ isLoadingGroups: false });
    }
  },

  setActiveGroup: (id) => set({ activeGroupId: id }),

  fetchMessages: async (groupId) => {
    set({ isLoadingMessages: true });
    try {
      const res = await messagesApi.getMessages(groupId, { limit: 50 });
      const msgs = res.messages;
      const last = msgs.length > 0 ? msgs[msgs.length - 1].id : 0;
      set((state) => ({
        messages: { ...state.messages, [groupId]: msgs },
        lastMessageId: { ...state.lastMessageId, [groupId]: last },
        isLoadingMessages: false,
      }));
    } catch {
      set({ isLoadingMessages: false });
    }
  },

  pollMessages: async (groupId) => {
    const state = get();
    const after = state.lastMessageId[groupId];
    if (after === undefined) return;
    try {
      const res = await messagesApi.getMessages(groupId, { after, limit: 50 });
      if (res.messages.length > 0) {
        const last = res.messages[res.messages.length - 1].id;
        set((s) => ({
          messages: {
            ...s.messages,
            [groupId]: [...(s.messages[groupId] || []), ...res.messages],
          },
          lastMessageId: { ...s.lastMessageId, [groupId]: last },
        }));
      }
    } catch {
      // silent
    }
  },

  sendMessage: async (groupId, content) => {
    set({ isSending: true });
    try {
      const msg = await messagesApi.send(groupId, { content });
      set((state) => ({
        messages: {
          ...state.messages,
          [groupId]: [...(state.messages[groupId] || []), msg],
        },
        lastMessageId: { ...state.lastMessageId, [groupId]: msg.id },
        isSending: false,
      }));
    } catch {
      set({ isSending: false });
      throw new Error('Xabar yuborishda xato');
    }
  },

  deleteMessage: async (groupId, messageId) => {
    await messagesApi.delete(groupId, messageId);
    set((state) => ({
      messages: {
        ...state.messages,
        [groupId]: (state.messages[groupId] || []).filter((m) => m.id !== messageId),
      },
    }));
  },

  addGroup: (group) =>
    set((state) => ({ groups: [group, ...state.groups] })),

  removeGroup: (groupId) =>
    set((state) => ({ groups: state.groups.filter((g) => g.id !== groupId) })),
}));
