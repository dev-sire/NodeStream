# NodeStream: Legacy YouTube, Reimagined

Welcome to NodeStream, a personal portfolio project aiming to recreate the classic YouTube experience with modern technologies and a touch of AI. Currently under development, NodeStream seeks to provide a familiar yet enhanced video streaming platform.

## Key Features

* **Classic YouTube Feel:** NodeStream's design draws inspiration from the legacy YouTube interface, aiming for a nostalgic user experience.
* **AI-Powered Content Creation:**
    * Planned feature (Deepseek and Cloudflare AI): Generate compelling video titles, descriptions, and thumbnails using AI, streamlining the content creation process.
* **Modern Tech Stack:**
    * Built on Next.js 15 for server-side rendering and performance.
    * Bun.js for fast and efficient runtime.
    * TypeScript for robust type safety.
    * Tailwind CSS and Shadcn for a sleek and responsive UI.
    * tRPC for seamless API communication.
    * Mux for high-quality video streaming.
    * UploadThing for efficient file uploads.
    * Upstash for rate limiting and AI background jobs.
    * Drizzle ORM for serverless SQL database management.

## Current Project Structure

```
📦 NodeStream
├─ .gitignore
├─ .vscode
│  └─ settings.json
├─ LICENSE
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
│  ├─ user-placeholder.svg
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
│  │  │  ├─ page.tsx
│  │  │  └─ videos
│  │  │     └─ [videoId]
│  │  │        └─ page.tsx
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
│  │  ├─ comments
│  │  │  ├─ server
│  │  │  │  └─ procedures.ts
│  │  │  └─ ui
│  │  │     └─ components
│  │  │        └─ comment-form.tsx
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
│  │  ├─ subscriptions
│  │  │  ├─ hooks
│  │  │  │  └─ use-subscriptions.ts
│  │  │  ├─ server
│  │  │  │  └─ procedures.ts
│  │  │  └─ ui
│  │  │     └─ componenets
│  │  │        └─ subscription-button.tsx
│  │  ├─ users
│  │  │  └─ ui
│  │  │     └─ components
│  │  │        └─ user-info.tsx
│  │  ├─ video-reactions
│  │  │  └─ server
│  │  │     └─ procedures.ts
│  │  ├─ video-views
│  │  │  └─ server
│  │  │     └─ procedures.ts
│  │  └─ videos
│  │     ├─ server
│  │     │  └─ procedures.ts
│  │     ├─ types.ts
│  │     └─ ui
│  │        ├─ components
│  │        │  ├─ video-banner.tsx
│  │        │  ├─ video-description.tsx
│  │        │  ├─ video-menu.tsx
│  │        │  ├─ video-owner.tsx
│  │        │  ├─ video-player.tsx
│  │        │  ├─ video-reactions.tsx
│  │        │  ├─ video-thumbnail.tsx
│  │        │  └─ video-top-row.tsx
│  │        ├─ sections
│  │        │  ├─ comments-section.tsx
│  │        │  ├─ suggestions-section.tsx
│  │        │  └─ videos-section.tsx
│  │        └─ views
│  │           └─ video-view.tsx
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

## Getting Started (Development)

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/dev-sire/NodeStream.git
    ```

2.  **Install dependencies:**

    ```bash
    bun install
    ```

3.  **Set up environment variables:**

    * Create a `.env.local` file and add your API keys, database credentials, and other necessary environment variables.

4.  **Run the development server:**

    ```bash
    bun run dev
    ```

5.  Open your browser and navigate to `http://localhost:3000`.

## Contributing

Contributions are welcome! If you'd like to contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and submit a pull request.

* We appreciate contributions for bug fixes, UI improvements, and new features that align with the project's vision.

## License

This project is licensed under the Mozilla Public License 2.0.

## Future Enhancements (Planned)

* Live chat functionality.
* Enhanced video editing tools.
* Improved AI-powered recommendation system.

## Contact

For questions, feedback, or collaboration, please reach out:

* **LinkedIn:** [Aman Shahid](https://www.linkedin.com/in/aman-shahid-32708a2b7/)
