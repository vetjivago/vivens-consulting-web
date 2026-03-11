import * as ftp from "basic-ftp";
import * as path from "path";
import * as fs from "fs";

async function uploadFolder() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        console.log("Connecting to FTP...");
        await client.access({
            host: "ftp.labscienceacademy.com",
            user: "vivens@vivenslab.com",
            password: "Lara2013!",
            secure: false
        });

        console.log("Connected successfully.");

        // As it is a sub FTP account (vivens@vivenslab.com), the root directory might be
        // the public_html/ or similar already. We will try to make the 'api' folder.

        try {
            await client.cd("public_html");
        } catch (e) {
            console.log("public_html not found, assuming root is public_html");
        }

        try {
            await client.ensureDir("api");
        } catch (e) {
            console.log("Could not enter or create api directory: ", e);
        }

        const localApiDir = path.join(process.cwd(), "api");
        console.log("Uploading files to remote /api...");
        await client.uploadFromDir(localApiDir);

        // Also upload the uploads folder and files we downloaded from Supabase Storage
        // Wait, the client might not have an "uploads" folder yet if it's new.
        const localUploadsDir = path.join(process.cwd(), "backup_banco_dados", "storage");
        if (fs.existsSync(localUploadsDir)) {
            try {
                await client.ensureDir("uploads");
                console.log("Uploading files to remote /api/uploads...");
                await client.uploadFromDir(localUploadsDir);
            } catch (e) {
                console.log("Could not enter or create uploads directory: ", e);
            }
        }

        console.log("FTP Upload completed successfully!");
    }
    catch (err) {
        console.error("FTP Error: ", err);
    }
    client.close();
}

uploadFolder();
