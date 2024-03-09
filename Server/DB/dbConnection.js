import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_DB , {
      dbName: "FULL_STACK_BLOGGING_APP",
    })
    .then(() => console.log("Database Connected SuccesFully"))
    .catch((err) => console.log("error In DB", err));
};
