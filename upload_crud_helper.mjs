import * as ftp from "basic-ftp";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function uploadFiles() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "ftp.labscienceacademy.com",
            user: "vivens@vivenslab.com",
            password: "Lara2013!",
            secure: false
        });

        try { await client.cd("public_html"); } catch (e) {}
        await client.cd("api");

        const files = ["crud_helper.php", "create_tables.php"];
        for (const f of files) {
            await client.uploadFrom(path.join(__dirname, "api", f), f);
            console.log(`✅ ${f} uploaded`);
        }
        console.log("Done!");
    } catch (err) {
        console.error("FTP Error:", err);
    }
    client.close();
}

uploadFiles();
