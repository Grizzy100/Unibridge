// //server/outpass-service/prisma.config.backup.ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});




// // import { defineConfig } from "prisma/config";

// // const db_url = 'postgresql://neondb_owner:npg_mCYW30xBUsTD@ep-quiet-flower-a18qu732-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require&schema=outpass';

// // export default defineConfig({
// //   schema: "prisma/schema.prisma",
// //   migrations: {
// //     path: "prisma/migrations",
// //   },
// //   datasource: {
// //     url: db_url,
// //   },
// // });

