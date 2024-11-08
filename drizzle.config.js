import { connection } from "next/server";

export default {
    dialect: 'postgresql',
    schema: './utils/schema.jsx', // Ensure the correct file extension
    out: './drizzle',
    dbCredentials: {
        url: "postgresql://finansmartDB_owner:2ftBmqpRAen8@ep-wandering-salad-a5hb0fz4.us-east-2.aws.neon.tech/finansmartDB?sslmode=require", // Only use url
        connectionString:"postgresql://finansmartDB_owner:2ftBmqpRAen8@ep-wandering-salad-a5hb0fz4.us-east-2.aws.neon.tech/finansmartDB?sslmode=require",
    
    },
};