## NodeStream: An online video steaming platform

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Project Structure

```
📦 NodeStream
├─ .gitignore
├─ .vscode
│  └─ settings.json
├─ README.md
├─ bun.lock
├─ components.json
├─ drizzle.config.ts
├─ eslint.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ logo.svg
│  ├─ next.svg
│  ├─ placeholder.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ src
│  ├─ app
│  │  ├─ (auth)
│  │  │  ├─ layout.tsx
│  │  │  ├─ sign-in
│  │  │  │  └─ [[...sign-in]]
│  │  │  │     └─ page.tsx
│  │  │  └─ sign-up
│  │  │     └─ [[...sign-up]]
│  │  │        └─ page.tsx
│  │  ├─ (home)
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ (studio)
│  │  │  ├─ layout.tsx
│  │  │  └─ studio
│  │  │     ├─ page.tsx
│  │  │     └─ videos
│  │  │        └─ [videoId]
│  │  │           └─ page.tsx
│  │  ├─ api
│  │  │  ├─ trpc
│  │  │  │  └─ [trpc]
│  │  │  │     └─ route.ts
│  │  │  ├─ uploadthing
│  │  │  │  ├─ core.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ users
│  │  │  │  └─ webhook
│  │  │  │     └─ route.ts
│  │  │  └─ videos
│  │  │     └─ webhook
│  │  │        └─ route.ts
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  └─ layout.tsx
│  ├─ components
│  │  ├─ filter-carousel.tsx
│  │  ├─ infinite-scroll.tsx
│  │  ├─ responsive-modal.tsx
│  │  ├─ ui
│  │  │  ├─ accordion.tsx
│  │  │  ├─ alert-dialog.tsx
│  │  │  ├─ alert.tsx
│  │  │  ├─ aspect-ratio.tsx
│  │  │  ├─ avatar.tsx
│  │  │  ├─ badge.tsx
│  │  │  ├─ breadcrumb.tsx
│  │  │  ├─ button.tsx
│  │  │  ├─ calendar.tsx
│  │  │  ├─ card.tsx
│  │  │  ├─ carousel.tsx
│  │  │  ├─ chart.tsx
│  │  │  ├─ checkbox.tsx
│  │  │  ├─ collapsible.tsx
│  │  │  ├─ command.tsx
│  │  │  ├─ context-menu.tsx
│  │  │  ├─ dialog.tsx
│  │  │  ├─ drawer.tsx
│  │  │  ├─ dropdown-menu.tsx
│  │  │  ├─ form.tsx
│  │  │  ├─ hover-card.tsx
│  │  │  ├─ input-otp.tsx
│  │  │  ├─ input.tsx
│  │  │  ├─ label.tsx
│  │  │  ├─ menubar.tsx
│  │  │  ├─ navigation-menu.tsx
│  │  │  ├─ pagination.tsx
│  │  │  ├─ popover.tsx
│  │  │  ├─ progress.tsx
│  │  │  ├─ radio-group.tsx
│  │  │  ├─ resizable.tsx
│  │  │  ├─ scroll-area.tsx
│  │  │  ├─ select.tsx
│  │  │  ├─ separator.tsx
│  │  │  ├─ sheet.tsx
│  │  │  ├─ sidebar.tsx
│  │  │  ├─ skeleton.tsx
│  │  │  ├─ slider.tsx
│  │  │  ├─ sonner.tsx
│  │  │  ├─ switch.tsx
│  │  │  ├─ table.tsx
│  │  │  ├─ tabs.tsx
│  │  │  ├─ textarea.tsx
│  │  │  ├─ toast.tsx
│  │  │  ├─ toaster.tsx
│  │  │  ├─ toggle-group.tsx
│  │  │  ├─ toggle.tsx
│  │  │  └─ tooltip.tsx
│  │  └─ user-avatar.tsx
│  ├─ constants.ts
│  ├─ db
│  │  ├─ index.ts
│  │  └─ schema.ts
│  ├─ hooks
│  │  ├─ use-intersection-observer.ts
│  │  ├─ use-mobile.tsx
│  │  └─ use-toast.ts
│  ├─ lib
│  │  ├─ mux.ts
│  │  ├─ ratelimit.ts
│  │  ├─ redis.ts
│  │  ├─ uploadthing.ts
│  │  └─ utils.ts
│  ├─ middleware.ts
│  ├─ modules
│  │  ├─ auth
│  │  │  └─ ui
│  │  │     └─ components
│  │  │        └─ auth-button.tsx
│  │  ├─ categories
│  │  │  └─ server
│  │  │     └─ procedures.ts
│  │  ├─ home
│  │  │  └─ ui
│  │  │     ├─ components
│  │  │     │  ├─ home-navbar
│  │  │     │  │  ├─ index.tsx
│  │  │     │  │  └─ search-input.tsx
│  │  │     │  └─ home-sidebar
│  │  │     │     ├─ index.tsx
│  │  │     │     ├─ main-section.tsx
│  │  │     │     └─ personal-section.tsx
│  │  │     ├─ layouts
│  │  │     │  └─ home-layout.tsx
│  │  │     ├─ sections
│  │  │     │  └─ categories-section.tsx
│  │  │     └─ views
│  │  │        └─ home-view.tsx
│  │  ├─ studio
│  │  │  ├─ server
│  │  │  │  └─ procedures.ts
│  │  │  └─ ui
│  │  │     ├─ components
│  │  │     │  ├─ studio-navbar
│  │  │     │  │  └─ index.tsx
│  │  │     │  ├─ studio-sidebar
│  │  │     │  │  ├─ index.tsx
│  │  │     │  │  └─ studio-sidebar-header.tsx
│  │  │     │  ├─ studio-upload-modal.tsx
│  │  │     │  ├─ studio-uploader.tsx
│  │  │     │  └─ thumbnail-upload-modal.tsx
│  │  │     ├─ layouts
│  │  │     │  └─ studio-layout.tsx
│  │  │     ├─ sections
│  │  │     │  ├─ form-section.tsx
│  │  │     │  └─ videos-section.tsx
│  │  │     └─ views
│  │  │        ├─ studio-view.tsx
│  │  │        └─ video-view.tsx
│  │  └─ videos
│  │     ├─ server
│  │     │  └─ procedures.ts
│  │     ├─ types.ts
│  │     └─ ui
│  │        └─ components
│  │           ├─ video-player.tsx
│  │           └─ video-thumbnail.tsx
│  ├─ scripts
│  │  └─ seed-categories.ts
│  └─ trpc
│     ├─ client.tsx
│     ├─ init.ts
│     ├─ query-client.ts
│     ├─ routers
│     │  └─ _app.ts
│     └─ server.tsx
├─ tailwind.config.ts
└─ tsconfig.json
```