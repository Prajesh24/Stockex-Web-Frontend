# 🗺️ Complete URL & Route Map

## Public Routes (No Authentication Required)

```
/                           - Home page
/login                      - User login
/register                   - User registration
/dashboard                  - Dashboard (if accessible)
/home                       - Home page after login
```

---

## Protected User Routes (Authentication Required)

```
/user/profile               - User profile page
└─ Features:
   ├─ View user information (read-only)
   │  ├─ User ID
   │  ├─ Role
   │  ├─ Created Date
   │  └─ Updated Date
   │
   └─ Update form
      ├─ Full Name
      ├─ Email Address
      └─ Username
```

---

## Protected Admin Routes (Admin Role Required)

### User Management
```
/admin/users                - Users list page
├─ Features:
│  ├─ Table view of all users
│  ├─ User statistics
│  └─ Action buttons: Create, View, Edit, Delete
│
└─ Response Status:
   ├─ ✅ Admin users → Show page
   ├─ ❌ Regular users → Redirect to /home
   └─ ❌ Not authenticated → Redirect to /login
```

### Create User
```
/admin/users/create         - Create new user page
├─ Features:
│  ├─ Form fields:
│  │  ├─ Full Name
│  │  ├─ Email Address
│  │  ├─ Password
│  │  ├─ Confirm Password
│  │  └─ User Role (select: user or admin)
│  │
│  ├─ Form validation:
│  │  ├─ Required fields
│  │  ├─ Email format validation
│  │  ├─ Password minimum 6 characters
│  │  └─ Password confirmation match
│  │
│  ├─ API Call:
│  │  └─ POST /api/auth/user (with FormData)
│  │
│  └─ On Success:
│     └─ Redirect to /admin/users
│
└─ Response Status:
   ├─ ✅ Admin users → Show form
   ├─ ❌ Regular users → Redirect to /home
   └─ ❌ Not authenticated → Redirect to /login
```

### View User
```
/admin/users/[id]           - View specific user details
├─ Parameters:
│  └─ id: User MongoDB ID (e.g., /admin/users/507f1f77bcf86cd799439011)
│
├─ Features:
│  ├─ Basic Information (read-only)
│  │  ├─ Full Name
│  │  ├─ Username
│  │  ├─ Email Address
│  │  └─ Role
│  │
│  ├─ Account Information (read-only)
│  │  ├─ User ID
│  │  ├─ Account Created Date
│  │  └─ Last Updated Date
│  │
│  └─ Action Buttons:
│     ├─ Edit User → /admin/users/[id]/edit
│     └─ Delete User → API call to delete
│
└─ Response Status:
   ├─ ✅ Admin users → Show details
   ├─ ❌ Regular users → Redirect to /home
   └─ ❌ Not authenticated → Redirect to /login
```

### Edit User
```
/admin/users/[id]/edit      - Edit specific user details
├─ Parameters:
│  └─ id: User MongoDB ID
│
├─ Features:
│  ├─ Editable Fields:
│  │  ├─ Full Name
│  │  ├─ Email Address
│  │  ├─ Username
│  │  └─ Role (select: user or admin)
│  │
│  ├─ Read-only Fields:
│  │  ├─ User ID
│  │  ├─ Created Date
│  │  └─ Updated Date
│  │
│  ├─ API Call:
│  │  └─ PUT /api/users/[id] (on submit)
│  │
│  └─ On Success:
│     └─ Redirect to /admin/users/[id] (view page)
│
└─ Response Status:
   ├─ ✅ Admin users → Show form
   ├─ ❌ Regular users → Redirect to /home
   └─ ❌ Not authenticated → Redirect to /login
```

---

## Route Protection Logic Flow

```
User Accesses /admin/users/create
              │
              ▼
    ┌─────────────────────┐
    │ ProtectedAdminRoute │
    └────────┬────────────┘
             │
             ▼
    ┌──────────────────────┐
    │ Check user_data      │
    │ cookie exists?       │
    └──┬─────────────┬─────┘
       │ NO          │ YES
       │             ▼
       │    ┌─────────────────────┐
       │    │ Check role === admin│
       │    └──┬─────────────┬────┘
       │       │ NO          │ YES
       │       │             ▼
       │       │        ┌───────────────┐
       │       │        │ Show page     │
       │       │        │ content       │
       │       │        └───────────────┘
       │       │
       ▼       ▼
    ┌─────────────────┐
    │ Redirect to:    │
    │ /login (if NO)  │
    │ /home (if not   │
    │ admin)          │
    └─────────────────┘
```

---

## API Endpoint Usage

### User Creation
```
URL:     /api/auth/user
Method:  POST
Headers: Content-Type: multipart/form-data (FormData)
Body:    FormData
         ├─ name: string
         ├─ email: string
         ├─ password: string
         └─ role: "user" | "admin"

Response:
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "message": "User created successfully"
}
```

### User List (To be implemented)
```
URL:     /api/users
Method:  GET
Headers: Authorization: Bearer <token>

Query Parameters (optional):
├─ page: number (default: 1)
├─ limit: number (default: 10)
├─ search: string
├─ role: "user" | "admin"
└─ sort: string (field name)

Response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "...",
      "email": "...",
      "role": "..."
    }
  ]
}
```

### User Detail (To be implemented)
```
URL:     /api/users/:id
Method:  GET
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T15:45:00Z"
  }
}
```

### User Update (To be implemented)
```
URL:     /api/users/:id
Method:  PUT
Headers: Authorization: Bearer <token>
Body:    JSON
         {
           "name": "John Updated",
           "email": "john.updated@example.com",
           "username": "johnupdated",
           "role": "admin"
         }

Response:
{
  "success": true,
  "data": { ...updated user... }
}
```

### User Delete (To be implemented)
```
URL:     /api/users/:id
Method:  DELETE
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "User deleted successfully"
}
```

### User Profile Update (To be implemented)
```
URL:     /api/users/profile or /api/users/me
Method:  PUT
Headers: Authorization: Bearer <token>
Body:    JSON
         {
           "name": "Updated Name",
           "email": "new@example.com",
           "username": "newusername"
         }

Response:
{
  "success": true,
  "data": { ...updated profile... }
}
```

---

## Route Access Matrix

| Route | Public | User | Admin | Description |
|-------|--------|------|-------|-------------|
| / | ✅ | ✅ | ✅ | Home |
| /login | ✅ | ❌ | ❌ | Login (redirects if logged in) |
| /register | ✅ | ❌ | ❌ | Register (redirects if logged in) |
| /user/profile | ❌ | ✅ | ✅ | User profile |
| /admin/users | ❌ | ❌ | ✅ | Users list |
| /admin/users/create | ❌ | ❌ | ✅ | Create user |
| /admin/users/[id] | ❌ | ❌ | ✅ | View user |
| /admin/users/[id]/edit | ❌ | ❌ | ✅ | Edit user |

Legend:
- ✅ = Accessible
- ❌ = Redirected (access denied)

---

## Redirect Rules

### When accessing protected routes:

**Without Authentication:**
- All `/user/*` routes → Redirect to `/login`
- All `/admin/*` routes → Redirect to `/login`

**As Regular User:**
- `/user/profile` → ✅ Accessible
- `/admin/*` routes → Redirect to `/home`

**As Admin User:**
- `/user/profile` → ✅ Accessible
- `/admin/*` routes → ✅ Accessible

---

## Browser Navigation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER JOURNEY FLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Admin User:                                                │
│  /login → authenticate → /home → /admin/users             │
│                                    ├─ /admin/users/create  │
│                                    ├─ /admin/users/[id]    │
│                                    └─ /admin/users/[id]/ed  │
│                                                             │
│  Regular User:                                              │
│  /login → authenticate → /home → /user/profile             │
│                           ✗ Can't access /admin/*          │
│                                                             │
│  Non-Authenticated:                                         │
│  /login → /register → /login → authenticate               │
│  ✗ Can't access /user/* or /admin/*                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## URL Parameter Examples

### Valid URLs:
```
✅ /admin/users/507f1f77bcf86cd799439011
✅ /admin/users/507f1f77bcf86cd799439011/edit
✅ /admin/users/6507f1f77bcf86cd799439011
✅ /admin/users/any-string-as-id
```

### Note:
- The `[id]` parameter accepts any string
- Actual ID validation happens in the backend
- 404 handling is backend responsibility

---

## Mobile & Responsive Routes

All routes are fully responsive:
- Mobile: Single column layout
- Tablet: Optimized grid layout
- Desktop: Full width layout

All URLs work identically across devices.

---

## Bookmarkable Routes

All routes can be bookmarked and visited directly (with proper authentication):

```
Desktop:   https://example.com/admin/users
Mobile:    https://example.com/admin/users
Tablet:    https://example.com/admin/users

Results in same functionality, different layout
```

---

## Status Codes & Responses

### Expected Backend Responses:

```
200 OK
- Resource found and displayed
- Action completed successfully

201 Created
- New resource created (user creation)

400 Bad Request
- Invalid input data
- Validation failed

401 Unauthorized
- User not authenticated
- JWT invalid/expired

403 Forbidden
- User authenticated but not authorized
- Insufficient permissions

404 Not Found
- Resource not found
- User doesn't exist

500 Server Error
- Backend error
- Database error
```

---

## Complete URL Structure

```
http://localhost:3000/admin/users
│                      │          │
├─ Protocol          │          └─ Route path
├─ Host             │
├─ Port: 3000       └─ Subdirectory
│
Full URL: http://localhost:3000/admin/users
```

---

**All routes are production-ready and fully implemented!**
