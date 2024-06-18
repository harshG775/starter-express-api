import app from "./app";
import { env } from "./utils/env";
const port = Number(env.PORT) || 4000;
(async () => {
    try {
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.log("Error starting server");
        console.log(error);
        process.exit(1);
    }
})();
