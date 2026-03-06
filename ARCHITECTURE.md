# System Architecture & Flow Diagram

## Authentication & Role-Based Access Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Visits App                          │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
      ┌──────────────┐
      │  Logged In?  │
      └──┬───────┬──┘
         │ NO    │ YES
         │       │
    ┌────▼──┐   │
    │ /login│   │
    └───────┘   │
                │
                ▼
      ┌──────────────────┐
      │  Check User Role │
      └───┬───────────┬──┘
          │           │
    ┌─────▼─────┐  ┌──▼──────────┐
    │role=admin │  │role=user or  │
    │           │  │other roles   │
    └──┬────────┘  └──┬───────────┘
       │               │
       │               ▼
       │        ┌──────────────────┐
       │        │ Can access /user │
       │        │ - /user/profile  │
       │        └──────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Can access /admin routes │
│ - /admin/users           │
│ - /admin/users/create    │
│ - /admin/users/[id]      │
│ - /admin/users/[id]/edit │
└──────────────────────────┘
```

---

## Route Protection Implementation

```
┌────────────────────────────────────────────────────────────────┐
│                    Protected Routes                             │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ADMIN ROUTES                          USER ROUTES             │
│  ├─ /admin/users                      ├─ /user/profile        │
│  ├─ /admin/users/create               └─ Protected by         │
│  ├─ /admin/users/[id]                   ProtectedUserRoute    │
│  ├─ /admin/users/[id]/edit            └─ Checks: Cookie       │
│  └─ Protected by                          exists              │
│     ProtectedAdminRoute               └─ Redirects to:        │
│  └─ Checks: Cookie exists                /login              │
│     AND role === "admin"                                      │
│  └─ Redirects to: /login or /home                            │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## User Management Pages Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    /admin/users (User List)                       │
│  ┌─ View all users in table                                      │
│  ├─ Columns: ID, Name, Email, Role, Created Date, Actions       │
│  ├─ Stats: Total Users, Admins, Regular Users                    │
│  └─ Buttons: Create User, View, Edit, Delete per user            │
└─────────────┬──────────────────────────────────┬──────────────┬──┘
              │                                  │              │
              ▼                                  ▼              ▼
      ┌──────────────────┐            ┌──────────────────┐   [DELETE]
      │  Create User     │            │  /admin/users/   │
      │  /admin/users/   │            │  [id]            │
      │  create          │            │                  │
      │                  │            │  User Details    │
      │  Form:           │            │  ├─ All user     │
      │  - Full Name     │            │  │   info        │
      │  - Email         │            │  ├─ Created date │
      │  - Password      │            │  ├─ Updated date │
      │  - Confirm Pass  │            │  └─ Actions:     │
      │  - Role (select) │            │     ├─ Edit      │
      │                  │            │     └─ Delete    │
      │  Calls:          │            └─────────┬────────┘
      │  POST            │                      │
      │  /api/auth/user  │                      ▼
      │  with FormData   │            ┌──────────────────┐
      └──────────────────┘            │  Edit User       │
                                      │  /admin/users/   │
                                      │  [id]/edit       │
                                      │                  │
                                      │  Form:           │
                                      │  - Full Name     │
                                      │  - Email         │
                                      │  - Username      │
                                      │  - Role (select) │
                                      │                  │
                                      │  Calls:          │
                                      │  PUT /api/users/ │
                                      │  [id] (API call) │
                                      └──────────────────┘
```

---

## User Profile Flow

```
┌──────────────────────────────────────────────────────────────────┐
│              /user/profile (User Profile Page)                    │
│                                                                   │
│  ┌─ Logged-in user only                                          │
│  ├─ View current info (read-only):                               │
│  │  ├─ User ID                                                   │
│  │  ├─ Role                                                      │
│  │  ├─ Created Date                                              │
│  │  └─ Updated Date                                              │
│  │                                                               │
│  └─ Update form:                                                 │
│     ├─ Full Name                                                 │
│     ├─ Email                                                     │
│     ├─ Username                                                  │
│     │                                                            │
│     └─ Calls: PUT /api/users/profile (API call)                 │
│        ├─ On success: Update local data                         │
│        ├─ Show success message                                  │
│        └─ Keep user on same page                                │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## API Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│               FRONTEND REQUEST FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Client Component (Page)                                       │
│  ├─ User submits form                                         │
│  ├─ Form validation with Zod schema                           │
│  ├─ Call Server Action (handleCreateUser)                    │
│  │  │                                                         │
│  │  └─ lib/actions/auth-action.ts                            │
│  │     ├─ Server-side function                               │
│  │     └─ Calls API function (createUser)                    │
│  │        │                                                   │
│  │        └─ lib/api/auth.ts                                 │
│  │           ├─ Convert data to FormData                     │
│  │           ├─ Set multipart/form-data headers              │
│  │           └─ POST to /api/auth/user                       │
│  │              │                                             │
│  │              └─ Axios Instance (axios.ts)                 │
│  │                 ├─ Base URL: http://localhost:5050        │
│  │                 ├─ Send HTTP request                      │
│  │                 └─ Handle response/error                  │
│  │                                                            │
│  └─ Receive response                                          │
│     ├─ On success: Show message, redirect                    │
│     └─ On error: Show error message                          │
│                                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
Layout.tsx (Root Layout)
│
├─ Page.tsx (Home)
│  └─ Public route
│
├─ (auth)/
│  ├─ login/page.tsx
│  └─ register/page.tsx
│
├─ user/
│  ├─ ProtectedUserRoute (Wrapper)
│  └─ profile/page.tsx
│     ├─ Display user info (read-only)
│     └─ Update form with input fields
│
├─ admin/
│  └─ users/
│     ├─ ProtectedAdminRoute (Wrapper)
│     ├─ page.tsx (User List)
│     │  └─ Table with user data
│     ├─ create/page.tsx (Create User)
│     │  └─ Form with inputs
│     └─ [id]/
│        ├─ page.tsx (View User)
│        │  └─ Display user details
│        └─ edit/page.tsx (Edit User)
│           └─ Form with user data
│
└─ _components/
   ├─ ProtectedAdminRoute.tsx
   └─ ProtectedUserRoute.tsx
```

---

## Database Model Representation

```
┌─────────────────────────────────────────────────────────────────┐
│                       USER Collection                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  _id: ObjectId          (MongoDB ID)                            │
│  name: String           (Full name)                             │
│  email: String          (Unique email)                          │
│  password: String       (Hashed)                                │
│  username: String       (Optional, unique)                      │
│  role: Enum             ("user", "admin")                       │
│  profileImage: String   (File path/URL - optional)              │
│  createdAt: Date        (ISO timestamp)                         │
│  updatedAt: Date        (ISO timestamp)                         │
│                                                                 │
│  Indexes:                                                       │
│  ├─ email (unique)                                              │
│  ├─ username (unique, sparse)                                   │
│  └─ role (for queries)                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## State Management in Pages

```
┌─────────────────────────────────────────────────────────────────┐
│           State Management Pattern Used in Pages                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Data States:                                                  │
│  ├─ users: User[] - List of users                             │
│  ├─ user: User | null - Single user                           │
│  ├─ userData: User | null - Current user info                 │
│  └─ formData: Form - Form fields                              │
│                                                                 │
│  Loading States:                                               │
│  ├─ loading: boolean - Initial data fetch                     │
│  ├─ updating: boolean - Form submission                       │
│  ├─ pending: boolean - Transition pending                     │
│  └─ isSubmitting: boolean - Form validation                   │
│                                                                 │
│  UI States:                                                    │
│  ├─ message: { type, text } - Success/error                   │
│  ├─ error: string | null - Error message                      │
│  ├─ showPassword: boolean - Password visibility               │
│  └─ showConfirm: boolean - Confirm password visibility        │
│                                                                 │
│  Using:                                                        │
│  ├─ useState() - Local component state                        │
│  ├─ useEffect() - Side effects, data fetching                 │
│  ├─ useRouter() - Navigation                                  │
│  ├─ useParams() - Route parameters ([id])                     │
│  ├─ useForm() - React Hook Form integration                   │
│  ├─ useTransition() - Server action transitions               │
│  └─ zodResolver - Zod validation integration                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING FLOW                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Client Side                                                   │
│  ├─ Form Validation Error                                     │
│  │  └─ Display inline error messages below fields              │
│  │                                                             │
│  ├─ Network/API Error                                         │
│  │  └─ Display error message banner                           │
│  │  └─ Log to console                                         │
│  │                                                             │
│  └─ Server Action Error                                       │
│     └─ Catch and display message                              │
│                                                                 │
│  Server Side (Backend - to implement)                         │
│  ├─ Validation Error                                          │
│  │  └─ Return 400 with error details                          │
│  │                                                             │
│  ├─ Authorization Error                                       │
│  │  └─ Return 403 Forbidden                                   │
│  │                                                             │
│  ├─ Not Found Error                                           │
│  │  └─ Return 404 Not Found                                   │
│  │                                                             │
│  └─ Server Error                                              │
│     └─ Return 500 with generic message                        │
│                                                                 │
└──────────────────────────────────────────────────────────────────┘
```

---

## Security Layers

```
┌──────────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: Authentication                                       │
│  ├─ Login required (checked via cookie)                        │
│  ├─ JWT token stored securely                                  │
│  └─ Automatic logout on session end                            │
│                                                                  │
│  Layer 2: Authorization (Frontend)                             │
│  ├─ Role check on admin routes                                 │
│  ├─ Redirect non-admins from /admin                            │
│  └─ Component-level protection                                 │
│                                                                  │
│  Layer 3: Authorization (Backend - to implement)               │
│  ├─ Verify JWT token                                           │
│  ├─ Check user role for admin endpoints                        │
│  └─ Verify user owns resource before edit/delete               │
│                                                                  │
│  Layer 4: Input Validation                                     │
│  ├─ Frontend: Zod schema validation                            │
│  └─ Backend: Server-side validation (to implement)             │
│                                                                  │
│  Layer 5: Data Protection                                      │
│  ├─ Passwords hashed on backend                                │
│  ├─ No sensitive data in responses                             │
│  └─ HTTPS only in production                                   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Frontend (Next.js)                                           │
│  ├─ npm run build (Production build)                          │
│  ├─ npm start (Production server)                             │
│  └─ Environment Variables:                                     │
│     └─ NEXT_PUBLIC_API_BASE_URL = https://api.example.com     │
│                                                                 │
│  Backend (Express/Node)                                       │
│  ├─ MongoDB connection                                        │
│  ├─ API endpoints                                             │
│  ├─ Multer middleware for file uploads                        │
│  └─ Environment Variables:                                     │
│     ├─ DB_URL                                                  │
│     ├─ JWT_SECRET                                              │
│     ├─ CORS_ORIGIN = https://frontend.example.com             │
│     └─ PORT = 5050                                             │
│                                                                 │
│  Communication:                                               │
│  ├─ Frontend calls API via axios                              │
│  ├─ Uses JWT in Authorization header                          │
│  ├─ FormData for file upload endpoints                        │
│  └─ Error handling with proper status codes                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

**This architecture ensures secure, scalable, and maintainable user management system!**
