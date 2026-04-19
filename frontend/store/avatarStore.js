/**
 * Avatar Store (State Management)
 * Location: frontend/store/avatarStore.js
 * 
 * Manages avatar state, messages, and UI state
 */

import { create } from 'zustand';

const useAvatarStore = create((set) => ({
  // UI State
  isExpanded: false,
  isLoading: false,
  currentExpression: 'happy',
  
  // Chat State
  messages: [],
  conversationId: null,

  // Actions
  toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setExpression: (expression) => set({ currentExpression: expression }),
  
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, {
        ...message,
        timestamp: new Date(),
      }],
    })),
  
  clearMessages: () => set({ messages: [] }),
  
  setMessages: (messages) => set({ messages }),
  
  setConversationId: (id) => set({ conversationId: id }),
  
  resetAvatar: () => set({
    isExpanded: false,
    isLoading: false,
    currentExpression: 'happy',
    messages: [],
    conversationId: null,
  }),
}));

export default useAvatarStore;
