import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vervrmflqvjbtxxpicmg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcnZybWZscXZqYnR4eHBpY21nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTAyMzg4NSwiZXhwIjoyMDg0NTk5ODg1fQ.8u0DokCqteqk8DFflcaAELPFX7UAwpumgO0gYNWKZS8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const tables = ["clients", "projects", "reports", "invoices"];
const backupDir = path.join(process.cwd(), 'backup_banco_dados');

async function runBackup() {
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const dumpData = {};

    for (const table of tables) {
        console.log("Fetching " + table + "...");
        const { data, error } = await supabase.from(table).select('*');
        if (error) {
            console.error("Error fetching " + table + ":", error.message);
            continue;
        }
        dumpData[table] = data;
        console.log("Fetched " + data.length + " rows from " + table);

        fs.writeFileSync(
            path.join(backupDir, table + ".json"),
            JSON.stringify(data, null, 2)
        );
    }

    fs.writeFileSync(
        path.join(backupDir, 'full_dump.json'),
        JSON.stringify(dumpData, null, 2)
    );

    console.log('✅ Data fetched and saved to backup_banco_dados as JSON.');
}

runBackup();
