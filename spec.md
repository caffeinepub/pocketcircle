# PocketCircle

## Current State
- Frontend-only app with local state (AppContext + localStorage)
- Sample post images reference `/assets/generated/post-beach-sunset.dim_800x500.jpg` etc. but these files don't exist → broken image placeholders
- Camera posts use `URL.createObjectURL()` which is ephemeral (breaks on reload)
- HomePage has a camera button in the header AND a FAB — user wants only ONE FAB
- ProfilePage has no avatar upload functionality
- PostCard renders images but has no error/fallback handling
- Layout has `pb-24` on main content and fixed bottom nav — may still visually overlap on some screens
- No blob storage wiring for newly uploaded images

## Requested Changes (Diff)

### Add
- Generate 3 sample images: `post-beach-sunset.dim_800x500.jpg`, `post-birthday-cake.dim_800x500.jpg`, `post-hiking-trail.dim_800x500.jpg`
- `useStorageUpload` hook: wraps StorageClient (from config.ts), returns `uploadImage(file): Promise<string>` that uploads to blob storage and returns a direct URL
- Profile avatar upload: clickable avatar on ProfilePage opens file picker, uploads image, updates user profile with returned URL
- Image fallback rendering in PostCard: `onError` handler shows a placeholder div instead of broken img tag
- Single FAB (bottom-right, always visible on mobile home feed) that opens CameraPostModal

### Modify
- `CameraPostModal.tsx`: use `useStorageUpload` to upload selected photo to blob storage; store returned URL as `photoUrl` in the post (not a blob: URL)
- `ProfilePage.tsx`: make avatar clickable, add hidden file input, upload and display profile photo
- `HomePage.tsx`: remove camera button from header; keep only the FAB in bottom-right corner
- `PostCard.tsx`: add `onError` fallback on img tags; add proper `object-cover` and aspect ratio
- `Layout.tsx`: ensure mobile main content has `pb-[calc(4rem+env(safe-area-inset-bottom))]`; nav uses `pb-[env(safe-area-inset-bottom)]`
- `index.css`: smoother glass cards (stronger blur, better border), improved spacing, stronger typography scale, subtle entrance animations

### Remove
- Header camera button from HomePage

## Implementation Plan
1. Generate 3 sample post images via image generation tool
2. Create `src/frontend/src/hooks/useStorageUpload.ts` — async hook that loads config, creates StorageClient, exposes `uploadImage(file: File): Promise<string>`
3. Update `CameraPostModal.tsx` to call `uploadImage` on file select; show upload progress; store real URL
4. Update `ProfilePage.tsx` with clickable avatar, file input, upload logic using `useStorageUpload`
5. Update `HomePage.tsx` — remove header camera icon, ensure FAB is bottom-right `fixed bottom-24 right-5` on mobile
6. Update `PostCard.tsx` — add `onError` → swap `<img>` for placeholder; ensure aspect ratio 4:5 for photo posts
7. Update `Layout.tsx` — safe-area padding on mobile nav and main content
8. Update `index.css` — polish glass styles, card shadows, typography
