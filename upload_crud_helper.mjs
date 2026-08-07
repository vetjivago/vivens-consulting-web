import * as ftp from "basic-ftp";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function uploadFile() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access({
            host: "ftp.labscienceacademy.com",
            user: "vivens@vivenslab.com",
            password: "Lara2013!",
            secure: false
        });

        console.log("Connected. Uploading crud_helper.php...");
        
        try { await client.cd("public_html"); } catch (e) { console.log("Skipping public_html cd"); }
        await client.cd("api");

        await client.uploadFrom(path.join(__dirname, "api/crud_helper.php"), "crud_helper.php");
        console.log("✅ crud_helper.php uploaded successfully!");
    } catch (err) {
        console.error("FTP Error:", err);
    }
    client.close();
}

uploadFile();
