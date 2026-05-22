# Dusk

![GitHub stars](https://img.shields.io/github/stars/DenylsonMiguel/Dusk?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/DenylsonMiguel/Dusk?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/DenylsonMiguel/Dusk?style=for-the-badge)
![GitHub pull requests](https://img.shields.io/github/issues-pr/DenylsonMiguel/Dusk?style=for-the-badge)
![GitHub license](https://img.shields.io/github/license/DenylsonMiguel/Dusk?style=for-the-badge)

Dusk is a sleep management application designed to help users maintain a healthy sleep schedule.

The app prevents users from casually ignoring bedtime by using sequence-based interactions and timely reminders.

![Dusk Preview](./assets/preview.png)

---

## Technologies Used

<p>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />

  
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" />
  
  <img src="https://img.shields.io/badge/Zod-3068B7?style=for-the-badge&logo=zod&logoColor=white" />
  
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" />
  
  <img src="https://img.shields.io/badge/YAML-CB171E?style=for-the-badge&logo=yaml&logoColor=white" />
</p>

## Requirements

- Node.js 24 LTS
- Yarn 1.22.22

## Installation

```bash
git clone https://github.com/DenylsonMiguel/Dusk.git
cd dusk
yarn
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

### Example:

```env
PORT=3000
DB_URI=<your_mongodb_connection_string>
CORS=http://localhost:5173
ACCESS_SECRET=<your_access_token_secret_key>
REFRESH_SECRET=<your_refresh_token_secret_key>
```

## Running

```bash
yarn dev
```

If everything is working correctly, you should see something similar to:

```bash
[LOG] - Server started on port 3000
[LOG] - Database initialized successfully
```

## API Documentation

Once the server is running, you can access the interactive API documentation at:

```
http://localhost:3000/docs
```

This Swagger UI interface allows you to explore all available endpoints, test requests, and view the complete API specification in real-time.

## Problems Faced

### Path aliases with ESM

Initially, the project used path aliases such as:

```ts
import { logger } from "@/helpers/logger.js";
```

However, after building the application, Node.js could not resolve the aliases correctly in the generated JavaScript files.

To avoid runtime issues and improve compatibility with the Node.js ESM environment, the aliases were replaced with relative imports such as:

```ts
import { logger } from "../../helpers/logger.js";
```

This ensured consistent behavior during both development and production builds.

## Next Steps

- Implement sleep logging system
- Implement user management sytem
- Add Docker
