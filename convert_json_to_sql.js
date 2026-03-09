import fs from "fs";
import path from "path";

const tables = ["clients", "projects", "reports", "invoices"];
const backupDir = path.join(process.cwd(), 'backup_banco_dados');

let sqlDump = '-- Supabase JSON to MySQL Migration Dump\n';
sqlDump += "-- Generated at: " + new Date().toISOString() + "\n\n";
sqlDump += 'SET FOREIGN_KEY_CHECKS=0;\n\n';

for (const table of tables) {
    const jsonPath = path.join(backupDir, table + '.json');
    if (fs.existsSync(jsonPath)) {
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        if (data.length > 0) {
            const keys = Object.keys(data[0]);

            let insertStatements = "INSERT INTO `" + table + "` (" + keys.map(k => "`" + k + "`").join(", ") + ") VALUES \n";

            const rowValues = data.map(row => {
                const vals = keys.map(k => {
                    let val = row[k];
                    if (val === null || val === undefined) return 'NULL';
                    if (typeof val === 'boolean') return val ? '1' : '0';
                    if (typeof val === 'number') return val.toString();
                    if (typeof val === 'object') {
                        val = JSON.stringify(val);
                    }
                    val = String(val)
                        .replace(/\\/g, '\\\\')
                        .replace(/'/g, "\\'");
                    return "'" + val + "'";
                });
                return "  (" + vals.join(', ') + ")";
            });

            insertStatements += rowValues.join(',\n') + ';\n\n';
            sqlDump += insertStatements;
        }
    }
}

sqlDump += 'SET FOREIGN_KEY_CHECKS=1;\n';

const dumpPath = path.join(backupDir, 'supabase_data_mysql.sql');
fs.writeFileSync(dumpPath, sqlDump);
console.log("✅ SQL Dump Created: " + dumpPath);
