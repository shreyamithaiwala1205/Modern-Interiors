require("dotenv").config();

const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const uri = process.env.MONGO_URI;

async function exportDatabase() {
    const client = new MongoClient(uri);

    try {
        await client.connect();

        console.log("Connected to MongoDB");

        const db = client.db("moderninteriors");

        // Get all collections
        const collections = await db.listCollections().toArray();

        const output = {};

        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;

            console.log(`Exporting collection: ${collectionName}`);

            const documents = await db
                .collection(collectionName)
                .find({})
                .toArray();

            output[collectionName] = documents;
        }

        // Create exports directory
        const outputDir = path.join(__dirname, "exports");

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        // Save everything into one JSON file
        const filePath = path.join(
            outputDir,
            "moderninteriors-backup.json"
        );

        fs.writeFileSync(
            filePath,
            JSON.stringify(output, null, 2),
            "utf8"
        );

        console.log("\nDatabase export completed!");
        console.log(`Saved to: ${filePath}`);

    } catch (error) {
        console.error("Export failed:", error);
    } finally {
        await client.close();
        console.log("MongoDB connection closed");
    }
}

exportDatabase();