# Movie Log

A web frontend for logging and managing personal movie watching records.
It talks to [Movie Log API](https://github.com/masaya-nishimura-09/movie-log-api).

## Features

- Register, log in, and log out (tokens are refreshed automatically)
- Update or delete your account
- Create, view, edit, and delete movie records
- Filter records by score, platform, mood tag, and genre
- Search records by title, sort them, and paginate the list
- Look up movies on TMDb when creating a record
- Upload poster images
- English and Japanese UI (negotiated from the browser language)
- Light and dark themes
- Mock mode that runs without the backend

## Tech Stack

- Next.js (App Router) / React
- TypeScript
- Tailwind CSS / shadcn/ui (Base UI)
- Zod
- Biome
- pnpm

## Getting Started

### Prerequisites

- Node.js 20.9+
- pnpm
- [Movie Log API](https://github.com/masaya-nishimura-09/movie-log-api)
    (not needed in mock mode)

### Installation

```bash
git clone https://github.com/masaya-nishimura-09/movie-log.git
cd movie-log
pnpm install
cp .env.example .env.local
# Edit .env.local with your configuration
pnpm dev
```

### Configuration

Create a `.env.local` file based on `.env.example`:

- `API_BASE_URL` - Base URL of Movie Log API
- `USE_MOCK` - Set to `true` to use mock data instead of the API

### Scripts

| Command          | Description                |
|------------------|----------------------------|
| `pnpm dev`       | Start the dev server      |
| `pnpm build`     | Build for production      |
| `pnpm start`     | Start the production build |
| `pnpm lint`      | Check with Biome          |
| `pnpm fix`       | Fix lint issues           |
| `pnpm format`    | Format with Biome         |
| `pnpm typecheck` | Run the TypeScript check  |

## Project Structure

```
src/
  app/            # Routes ([lang]/(auth), [lang]/(app))
  actions/        # Server Actions
  api/            # Backend API clients and mock data
  components/     # UI components (atoms / molecules / organisms)
  schemas/        # Zod schemas
  i18n/           # Locales and dictionaries
  lib/            # Helpers (auth, date, record, style, text, url)
  styles/         # Global styles
  proxy.ts        # Locale routing and token refresh
docs/             # Working documents
```

## Pages

| Path                     | Description   | Auth |
|--------------------------|---------------|------|
| /:lang/login             | Login         | No   |
| /:lang/register          | Register      | No   |
| /:lang/records           | List records  | Yes  |
| /:lang/records/new       | Create record | Yes  |
| /:lang/records/:id       | Record detail | Yes  |
| /:lang/records/:id/edit  | Edit record   | Yes  |
| /:lang/account           | Account       | Yes  |
