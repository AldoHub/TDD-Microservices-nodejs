import expressApp from "./expressApp";
import { logger } from "./utils";

const PORT = process.env.PORT || 8000;


export const StartServer = async() => {
    expressApp.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });

    //in case something wrong happens with the server
    process.on("uncaughtException", async(err) => {
        logger.error(err);
        process.exit(1);
    })
}


StartServer().then(() => {
    logger.info("**********CATALOG SERVER RUNNING")
})