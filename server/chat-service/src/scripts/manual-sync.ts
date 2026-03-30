import "dotenv/config";
import { syncToChroma } from "../services/sync.service.js";

void syncToChroma()
  .then(() => {
    console.log("[manual-sync] Done");
    process.exit(0);
  })
  .catch((error) => {
    console.error("[manual-sync] Failed", error);
    process.exit(1);
  });
