# Indonesian Cultural Game

A small Indonesian cultural trivia game with a one-per-session prize draw.

## Prize

A winning completed session receives 3 Indomie packs and 1 Baju Barong Bali T-shirt. The server draws a cryptographically random ticket from 1 to 1,000 and records the result in PostgreSQL.

## Run locally

Requirements: .NET 8 SDK, Node.js, npm, and Docker with Docker Compose.

In a PowerShell terminal, set local credentials and start PostgreSQL:

```powershell
$env:POSTGRES_PASSWORD = "choose-a-local-password"
$env:ConnectionStrings__Default = "Host=localhost;Port=5432;Database=indogame;Username=indogame;Password=$($env:POSTGRES_PASSWORD)"
$env:AdminToken = "replace-with-a-long-random-token"
docker compose up -d db
```

Start the API from `backend/IndonesianGame.Api` with `dotnet run`. In a second terminal, start the frontend from `frontend` with `npm install` and `npm run dev -- --host 0.0.0.0`.

The connection string and admin token are intentionally blank in the checked-in app settings. Supply real values through environment variables, and use strong unique credentials before any internet-facing deployment.
