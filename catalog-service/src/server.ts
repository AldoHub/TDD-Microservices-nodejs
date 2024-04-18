import expressApp from "./expressApp";

const PORT = process.env.PORT || 8000;


export const StartServer = async() => {
    expressApp.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    //in case something wrong happens with the server
    process.on("uncaughtException", async(err) => {
        console.log(err);
        process.exit(1);
    })


}


StartServer().then(() => {
    console.log("**********CATALOG SERVER RUNNING")
})