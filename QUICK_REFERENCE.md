# Quick Reference Guide - Admin Frontend Routes

## Protected Routes

### User Routes (Authenticated users only)
```
/user/profile
  - Update logged-in user profile
  - Display user information (ID, role, created date)
  - Form to update: name, email, username
```

### Admin Routes (Authenticated admin users only)
```
/admin/users
  - View all users in table format
  - User statistics (total, admins, regular users)
  - Actions: View, Edit, Delete per user
  - Create User button

/admin/users/create
  - Form to create new user
  - Fields: name, email, password, confirm password, role
  - Uses FormData for Multer compatibility
  - Calls POST /api/auth/user

/admin/users/[id]
  - View detailed user information
  - Display: name, email, username, role, ID, created date, updated date
  - Actions: Edit User, Delete User

/admin/users/[id]/edit
  - Form to edit user information
  - Editable fields: name, email, username, role
  - Read-only fields: user ID, timestamps
  - Calls update API (needs implementation)
```

## Route Protection

### ProtectedAdminRoute Component
- Checks: `user_data` cookie exists AND `role === "admin"`
- Redirects non-admin to: `/home`
- Redirects non-authenticated to: `/login`
- Location: `app/_components/ProtectedAdminRoute.tsx`

### ProtectedUserRoute Component
- Checks: `user_data` cookie exists
- Redirects non-authenticated to: `/login`
- Location: `app/_components/ProtectedUserRoute.tsx`

## API Endpoints

### User Creation
```
POST /api/auth/user

Request (FormData):
- name: string
- email: string
- password: string
- role: "user" | "admin"

Response:
{
  success: boolean,
  data: user object,
  message?: string
}
```

## Implementation Details

### Schema Validation
Location: `app/(auth)/_components/schema.ts`

```typescript
createUserSchema - validates user creation form
- name: min 2 characters
- email: valid email format
- password: min 6 characters
- confirmPassword: must match password
- role: must be "user" or "admin"
```

### Server Actions
Location: `lib/actions/auth-action.ts`

```typescript
handleCreateUser(data: CreateUserData)
- Calls createUser() API function
- Returns: { success, message, data }
- Used in /admin/users/create page
```

### API Functions
Location: `lib/api/auth.ts`

```typescript
createUser(userData: CreateUserData)
- Converts data to FormData
- Sets multipart/form-data headers
- Calls POST /api/auth/user
- Throws error with backend message on failure
```

## Authentication Data Structure

Stored in cookies:
```
auth_token: JWT token string
user_data: {
  _id: string,
  email: string,
  username: string,
  role: "user" | "admin",
  createdAt: ISO string,
  updatedAt: ISO string,
  [key: string]: any
}
```

## Styling Theme

- **Primary Colors:** Green-500, Emerald-600 (actions)
- **Secondary Colors:** Yellow-500 (edit)
- **Danger Colors:** Red-500 (delete/admin)
- **Info Colors:** Blue-500 (user role)
- **Background:** Black/Gray-900 with gradient
- **Borders:** White/10 opacity
- **Text:** White/Gray-300 with varying opacity

## Dummy Data vs Real API

### Currently Dummy:
- User list in `/admin/users`
- User details in `/admin/users/[id]`
- User edit in `/admin/users/[id]/edit`

### Need API Integration:
1. Update `/admin/users` to fetch users list
2. Update `/admin/users/[id]` to fetch specific user
3. Update `/admin/users/[id]/edit` to fetch and update user
4. Implement delete user functionality
5. Implement user profile update in `/user/profile`

### Example API Call Pattern:
```typescript
// In API file (lib/api/*)
export const getUsers = async () => {
  const response = await axios.get('/api/users');
  return response.data;
}

// In page component (use client)
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      setError(error.message);
    }
  };
  fetchUsers();
}, []);
```

## Testing Credentials

To test, use these scenarios:

1. **Admin User:**
   - Should access: /admin/*, /user/profile
   - Should NOT access: /auth/login (redirected to /home)

2. **Regular User:**
   - Should access: /user/profile
   - Should NOT access: /admin/* (redirected to /home)

3. **Non-Authenticated:**
   - Should NOT access: /admin/*, /user/profile
   - Redirected to: /login

## File Locations

### Components
- `app/_components/ProtectedAdminRoute.tsx`
- `app/_components/ProtectedUserRoute.tsx`

### Pages
- `app/user/profile/page.tsx`
- `app/admin/users/page.tsx`
- `app/admin/users/[id]/page.tsx`
- `app/admin/users/[id]/edit/page.tsx`
- `app/admin/users/create/page.tsx`

### Libraries/Actions
- `lib/api/auth.ts` - API functions
- `lib/api/endpoints.ts` - API URLs
- `lib/actions/auth-action.ts` - Server actions
- `app/(auth)/_components/schema.ts` - Validation schemas

---

**Ready for development! Connect the dummy data to your backend APIs.**
