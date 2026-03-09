import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vervrmflqvjbtxxpicmg.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HVID88-okdcFaWwEkKu89g_xER8yerE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
