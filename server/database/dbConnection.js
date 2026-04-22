import mongoose from "mongoose";
import dns from "dns";

export const dbConnection = () => {
  // Corporate DNS blocks SRV queries — use Google DNS to resolve Atlas SRV records
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "MERN_JOB_SEEKING_WEBAPP",
    })
    .then(() => {
      console.log("Connected to database.");
    })
    .catch((err) => {
      console.log(`Some Error occured. ${err}`);
    });
};
