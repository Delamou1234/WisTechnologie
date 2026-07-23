<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/79170cec-6371-4cc2-a69d-fdf9527ce00a

## Run Locally

**Prerequisites:** Node.js, Docker (for the PostgreSQL database)

1. Copy the environment template and adjust if needed (defaults already match `docker-compose.yml`):
   `cp .env.example .env`
2. Install dependencies:
   `npm install`
3. Start the database container:
   `npm run db:up`
4. Run the app:
   `npm run dev`

The app connects to PostgreSQL using `DB_HOST`/`DB_PORT`/`DB_NAME`/`DB_USER`/`DB_PASSWORD` from `.env` (or a single `DATABASE_URL`, which takes priority). On first boot with an empty database, the server seeds the content tables from `data-store.json` if that legacy file is present, otherwise from the built-in defaults in `src/data.ts`.

Other database commands:
- `npm run db:down` — stop the container
- `npm run db:logs` — tail the Postgres logs
