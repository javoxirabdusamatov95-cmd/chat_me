# ChatMe — Frontend Holati va Qolgan Ishlar

> **Design:** `ChatMe _standalone_.html` — qora fon, binafsha gradient  
> **Backend:** FastAPI `http://localhost:8000` — tayyor  
> **Frontend:** `frontend/` — Next.js 16 + Tailwind v4 + Shadcn/ui + Zustand

---

## BAJARILGAN ISHLAR ✅

### Loyiha asosi

| Fayl                                     | Holat                                                                       |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| `package.json`                           | ✅ axios, zustand, date-fns, lucide-react, next-themes, barcha Radix paketi |
| `next.config.ts`                         | ✅ Image remotePatterns + `/api/*` rewrites                                 |
| `app/globals.css`                        | ✅ Dark/light tema, violet primary (`hsl(262 83% ...)`), scrollbar          |
| `tailwind.config` + `postcss.config.mjs` | ✅ Tailwind v4 sozlangan                                                    |

### Shadcn/ui komponentlari

| Komponent                                           | Holat |
| --------------------------------------------------- | ----- |
| `button`, `input`, `label`, `card`                  | ✅    |
| `dialog`, `dropdown-menu`                           | ✅    |
| `avatar`, `badge` (+ `success` variant qo'shilgan!) | ✅    |
| `separator`, `scroll-area`, `textarea`              | ✅    |
| `toast`, `alert`                                    | ✅    |

### Ma'lumotlar qatlami

| Fayl             | Holat                                                                                |
| ---------------- | ------------------------------------------------------------------------------------ |
| `types/index.ts` | ✅ Barcha 15+ tip: User, Group, Message, Invitation, Enums                           |
| `lib/api.ts`     | ✅ `authApi`, `usersApi`, `groupsApi`, `messagesApi`, `invitationsApi` — 21 endpoint |
| `lib/utils.ts`   | ✅ `cn`, `formatTime`, `formatDate`, `getInitials`, `getAvatarColor`                 |

### Holat boshqaruvi (Zustand)

| Store                | Holat                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `store/authStore.ts` | ✅ `login`, `register`, `logout`, `fetchMe`, `setUser`, xato holatlari                                                     |
| `store/chatStore.ts` | ✅ `fetchGroups`, `fetchMessages`, `pollMessages` (3s interval), `sendMessage`, `deleteMessage`, `addGroup`, `removeGroup` |

### Sahifalar va layout

| Fayl                                   | URL                 | Holat                                                       |
| -------------------------------------- | ------------------- | ----------------------------------------------------------- |
| `app/page.tsx`                         | `/`                 | ✅ `/chat` ga redirect                                      |
| `app/(auth)/layout.tsx`                | —                   | ✅ Markazlashtirilgan auth wrapper                          |
| `app/(auth)/login/page.tsx`            | `/login`            | ✅ Login form, show/hide parol, xato alert                  |
| `app/(auth)/register/page.tsx`         | `/register`         | ✅ Register form, parol tasdiqlash, validatsiya             |
| `app/(main)/layout.tsx`                | —                   | ✅ Auth guard: token yo'q → `/login`, token bor → `fetchMe` |
| `app/(main)/chat/layout.tsx`           | —                   | ✅ `<Sidebar>` + `<main>` flex layout                       |
| `app/(main)/chat/page.tsx`             | `/chat`             | ✅ Bo'sh holat — logo + "Guruh tanlang" matni               |
| `app/(main)/chat/[groupId]/page.tsx`   | `/chat/:id`         | ✅ `<ChatArea groupId={id}>`                                |
| `app/(main)/chat/invitations/page.tsx` | `/chat/invitations` | ✅ Pending + tarix, accept/reject                           |
| `app/(main)/invitations/page.tsx`      | `/invitations`      | ✅ `/chat/invitations` ga redirect                          |
| `app/(main)/profile/page.tsx`          | `/profile`          | ✅ Bio, avatar URL tahrirlash, qo'shilgan sana              |
| `app/(main)/profile/layout.tsx`        | —                   | ✅ Pass-through (auth `(main)/layout` dan o'tgan)           |

### Komponentlar

| Fayl                                   | Holat                                                                                                                                           |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/shared/Providers.tsx`      | ✅ `ThemeProvider` (dark default) + `ToastProvider`                                                                                             |
| `components/shared/UserAvatar.tsx`     | ✅ Avatar rasm yoki rang fallback (id % colors)                                                                                                 |
| `components/shared/ThemeToggle.tsx`    | ✅ Dark/light almashtirish                                                                                                                      |
| `components/chat/Sidebar.tsx`          | ✅ ChatMe logo, Guruhlar/Takliflar nav, guruhlar ro'yxati (loading skeleton bor), user dropdown (Profil, Chiqish), ThemeToggle                  |
| `components/chat/CreateGroupModal.tsx` | ✅ Dialog, nom + tavsif, `POST /groups`                                                                                                         |
| `components/chat/ChatArea.tsx`         | ✅ Header (guruh nomi, a'zo soni, Taklif/A'zolar/Settings), xabarlar ro'yxati, polling 3s, members dialog (kick tugmasi), leave/delete dropdown |
| `components/chat/MessageItem.tsx`      | ✅ O'z/boshqa bubble (binafsha / muted), hover da delete, sender avatar + nom                                                                   |
| `components/chat/MessageInput.tsx`     | ✅ Textarea auto-resize (max 120px), Enter → yuborish, Shift+Enter → yangi qator, loading spinner                                               |
| `components/chat/InviteModal.tsx`      | ✅ Username kiritish, `POST /groups/{id}/invite`, xato/muvaffaqiyat xabari                                                                      |

---

## BAJARILMAGAN ISHLAR ❌ (3 ta)

---

### 1. `proxy.ts` → `middleware.ts` ga o'zgartirish

**Muammo:** `frontend/proxy.ts` fayli Next.js middleware sifatida ishlamaydi — Next.js faqat **`middleware.ts`** nomidagi faylni tan oladi (loyiha ildizida yoki `src/` da).

**Hozirgi holat:**

- `proxy.ts` da to'g'ri kod yozilgan (protected routes, auth redirect logikasi)
- Lekin fayl nomi noto'g'ri → middleware hech qachon ishlamaydi
- Auth hali ham ishlaydi, chunki `(main)/layout.tsx` da client-side `localStorage` tekshiruvi bor

**Bajarish:**

```
frontend/proxy.ts → frontend/middleware.ts (faylni nomini o'zgartirish)
```

> Qo'shimcha: middleware `localStorage` ga kira olmaydi (server-side), shuning uchun `cookies.get("access_token")` ishlatiladi. Token cookie da saqlanishi uchun `authStore.ts` dagi `localStorage.setItem` ni `document.cookie` ga ham yozish kerak, yoki middleware ni olib tashlab, faqat layout.tsx auth guard bilan ishlash kerak.

**Tavsiya:** `middleware.ts` ni yaratish o'rniga **hozirgi `layout.tsx` auth guard bilan davom etish** (client-side, localStorage — yetarli). `proxy.ts` faylini o'chirish.

---

### 2. Guruhni tahrirlash modali (`EditGroupModal`)

**Muammo:** Backend da `PUT /groups/{id}` endpoint tayyor, lekin frontendda bu funksiya yo'q.

**Hozirgi holat:**

- `ChatArea.tsx` dagi Settings `DropdownMenu` faqat 2 ta element: "Guruhdan chiqish" va "Guruhni o'chirish"
- Admin uchun guruh nomini yoki tavsifini o'zgartirish imkoni yo'q

**Bajarish:**

**2.1 `components/chat/EditGroupModal.tsx` yaratish**

- Shadcn `Dialog` komponentidan foydalanish
- `groupId` + `currentName` + `currentDescription` props
- `PUT /groups/{id} → { name, description }` so'rovi
- Muvaffaqiyatli → header yangilash (`groupDetail` state refresh)

**2.2 `ChatArea.tsx` ga qo'shish**

- `DropdownMenu` ga "Guruhni tahrirlash" element qo'shish (faqat `isAdmin` uchun)
- `<EditGroupModal>` ni import qilish va state (`showEdit`) bilan boshqarish
- Muaffaqiyatli edit dan so'ng `loadGroup()` chaqirish

```tsx
// ChatArea.tsx DropdownMenu ga qo'shish (isAdmin bloki ichida):
{
	isAdmin && (
		<DropdownMenuItem onClick={() => setShowEdit(true)}>
			<Pencil className='h-4 w-4' /> Guruhni tahrirlash
		</DropdownMenuItem>
	)
}

// EditGroupModal komponenti:
// GET /groups/{id} → joriy nom/tavsifni yuklash
// PUT /groups/{id} → yangilash
// onSuccess → loadGroup() chaqirish
```

---

### 3. Sidebar da takliflar badge soni

**Muammo:** Sidebar dagi "Takliflar" link dan foydalanuvchi bilmaydi qancha yangi taklif bor.

**Hozirgi holat:**

```tsx
// Sidebar.tsx — hozir faqat link bor, badge yo'q:
<Link href='/chat/invitations'>
	<Bell className='h-3.5 w-3.5' /> Takliflar
</Link>
```

**Bajarish:**

**3.1 `store/chatStore.ts` ga `pendingInvitationsCount` qo'shish**

```ts
pendingInvitationsCount: number
fetchInvitationsCount: () => Promise<void>
```

**3.2 `Sidebar.tsx` ga polling qo'shish**

- `useEffect` + `setInterval` bilan har **30 soniyada** `GET /invitations` chaqirish
- Pending sonini `<Badge>` da ko'rsatish

```tsx
// Sidebar.tsx da:
<Link href="/chat/invitations" className={...}>
  <Bell className="h-3.5 w-3.5" /> Takliflar
  {pendingCount > 0 && (
    <Badge className="ml-auto h-4 min-w-4 px-1 text-[10px]">
      {pendingCount}
    </Badge>
  )}
</Link>
```

---

## BAJARISH KETMA-KETLIGI

```
1. proxy.ts → o'chirish (auth layout.tsx dan ishlayapti)
2. EditGroupModal komponentini yaratish
3. ChatArea.tsx ga "Tahrirlash" dropdown elementi qo'shish
4. chatStore.ts ga pendingInvitationsCount qo'shish
5. Sidebar.tsx ga badge va polling qo'shish
```

---

## UMUMIY HOLAT

| Qism                          | Bajarilgan      | Qolgan                 |
| ----------------------------- | --------------- | ---------------------- |
| Backend                       | 21/21 endpoint  | 0                      |
| Loyiha setup                  | ✅              | —                      |
| Shadcn komponentlar           | ✅              | —                      |
| Tip va API qatlami            | ✅              | —                      |
| Zustand store                 | ✅              | —                      |
| Auth sahifalari               | ✅              | —                      |
| Auth guard                    | ✅ (layout.tsx) | middleware.ts muammosi |
| Chat layout va sidebar        | ✅              | Taklif badge yo'q      |
| Chat area va polling          | ✅              | Edit group yo'q        |
| Xabarlar (yuborish/o'chirish) | ✅              | —                      |
| A'zolar + kick                | ✅              | —                      |
| Taklif yuborish (InviteModal) | ✅              | —                      |
| Guruh yaratish                | ✅              | —                      |
| **Guruh tahrirlash**          | ❌              | **Kerak**              |
| Takliflar sahifasi            | ✅              | —                      |
| **Sidebar taklif badge**      | ❌              | **Kerak**              |
| Profil sahifasi               | ✅              | —                      |
| Dark/light tema               | ✅              | —                      |

**Qolgan ish: 2 komponent + 1 kichik o'zgartirish**

### Keyingi ishlar

# 1 Responsive

# 2 SEO qilish kerak

# Reply Backend

# deploy
