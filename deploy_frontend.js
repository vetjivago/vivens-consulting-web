import * as ftp from "basic-ftp";
import * as path from "path";

async function uploadFrontend() {
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

        try {
            await client.cd("public_html");
        } catch (e) {
            console.log("public_html not found, assuming root is public_html");
        }

        const localDistDir = path.join(process.cwd(), "dist");
        console.log("Uploading frontend files from dist/ to remote root...");
        await client.uploadFromDir(localDistDir);

        console.log("Frontend FTP Upload completed successfully!");
    } catch (err) {
        console.log("FTP Upload Error: ", err);
    }
    client.close();
}

uploadFrontend();
