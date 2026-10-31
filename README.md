# Indonesian Cultural Game

A small Indonesian cultural trivia game with a one-per-session prize draw.

## Prize

A winning completed session receives 3 Indomie packs and 1 Baju Barong Bali T-shirt. The server draws a cryptographically random ticket from 1 to 1,000 and records the result in PostgreSQL.

## Run locally

Requirements: .NET 8 SDK, Node.js, npm, and Docker with Docker Compose.

1. Start PostgreSQL: `docker compose up -d db`
2. Start the API from `backend/IndonesianGame.Api` using `dotnet run`.
3. Start the frontend from `frontend` using `npm install` and `npm run dev -- --host 0.0.0.0`.

Set `AdminToken` and the database connection string through environment variables before using an internet-facing deployment. The values in local configuration are development defaults only.

