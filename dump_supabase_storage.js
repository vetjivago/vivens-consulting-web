import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import https from "https";

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vervrmflqvjbtxxpicmg.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HVID88-okdcFaWwEkKu89g_xER8yerE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const buckets = ['client-documents', 'project-images', 'project-files'];
const backupDir = path.join(process.cwd(), 'backup_banco_dados', 'storage');

async function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(true);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            resolve(false);
        });
    });
}

async function listAllFiles(bucket, folder = '') {
    const { data, error } = await supabase.storage.from(bucket).list(folder);
    if (error) return [];
    let files = [];
    for (const item of data) {
        if (item.id === null) {
            // It's a folder (Supabase represents folders with id = null)
            const subFolder = folder ? folder + '/' + item.name : item.name;
            const subFiles = await listAllFiles(bucket, subFolder);
            files.push(...subFiles);
        } else {
            files.push({
                bucket: bucket,
                path: folder ? folder + '/' + item.name : item.name,
                name: item.name
            });
        }
    }
    return files;
}

async function runStorageBackup() {
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    for (const bucket of buckets) {
        console.log("Checking bucket: " + bucket);
        // Explicitly listing folders is tricky in supabase, let's try root first
        const files = await listAllFiles(bucket);

        if (files.length === 0) continue;

        console.log("Found " + files.length + " files in " + bucket);

        const bucketDir = path.join(backupDir, bucket);
        if (!fs.existsSync(bucketDir)) fs.mkdirSync(bucketDir, { recursive: true });

        for (const file of files) {
            const { data } = supabase.storage.from(bucket).getPublicUrl(file.path);
            if (data && data.publicUrl) {
                // Create subdirectories if needed
                const filePath = path.join(bucketDir, file.path);
                const fileDir = path.dirname(filePath);
                if (!fs.existsSync(fileDir)) {
                    fs.mkdirSync(fileDir, { recursive: true });
                }

                console.log("Downloading " + file.path + "...");
                await downloadFile(data.publicUrl, filePath);
            }
        }
    }
    console.log("Storage backup complete.");
}

runStorageBackup();
