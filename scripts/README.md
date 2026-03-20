# Scripts

Utility scripts for interacting with Strapi REST API.

## strapi-client.ts

Strapi REST API utility module providing helper functions for common operations.

### Functions

- `strapiFind(collection, filters)` — Query collection with filters
- `strapiCreate(collection, data)` — Create new entry
- `strapiUpdate(collection, id, data)` — Update existing entry
- `uploadImage(filePath)` — Upload image to Strapi media library

### Configuration

Set environment variables before use:

```bash
export STRAPI_URL=http://localhost:1337
export STRAPI_TOKEN=your_api_token_here
```

### Usage

Import in custom scripts that need to interact with Strapi REST API:

```typescript
import { strapiFind, strapiCreate, strapiUpdate, uploadImage } from './strapi-client'
```
