"use strict";
import fs from 'fs';
import path from 'path';
import pg from 'pg';
const { Client } = pg;

// Supabase DB Connection String
const supabaseConnectionString = 'postgresql://postgres:sW1DQngOzTrDpqBc@db.vervrmflqvjbtxxpicmg.supabase.co:5432/postgres';

const backupDir = path.join(process.cwd(), 'backup_banco_dados');

// Helper to map PostgreSQL types to MySQL
function getMysqlType(pgType, charMaxLength) {
    const typeMap = {
        'integer': 'INT',
        'bigint': 'BIGINT',
        'smallint': 'SMALLINT',
        'boolean': 'TINYINT(1)',
        'character varying': charMaxLength ? "VARCHAR(" + charMaxLength + ")" : 'VARCHAR(255)',
        'text': 'LONGTEXT',
        'timestamp with time zone': 'DATETIME',
        'timestamp without time zone': 'DATETIME',
        'date': 'DATE',
        'json': 'JSON',
        'jsonb': 'JSON',
        'uuid': 'VARCHAR(36)',
        'numeric': 'DECIMAL(10,2)',
        'real': 'FLOAT',
        'double precision': 'DOUBLE'
    };
    return typeMap[pgType.toLowerCase()] || 'VARCHAR(255)';
}

function escapeValue(val) {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'boolean') return val ? '1' : '0';
    if (typeof val === 'number') return val.toString();
    if (typeof val === 'object') {
        if (val instanceof Date) {
            return "'" + val.toISOString().slice(0, 19).replace('T', ' ') + "'";
        }
        // Stringify JSON
        val = JSON.stringify(val);
    }
    // Escape quotes and backslashes for MySQL
    val = String(val)
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'");
    return "'" + val + "'";
}

async function runBackup() {
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const client = new Client({ connectionString: supabaseConnectionString });

    try {
        console.log('⏳ Connecting to Supabase database...');
        await client.connect();
        console.log('✅ Connected successfully!');

        // 1. Get all tables in public schema
        const tablesRes = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'");

        const tables = tablesRes.rows.map(r => r.table_name);
        console.log("📦 Found " + tables.length + " tables: " + tables.join(', '));

        let sqlDump = '-- Supabase to MySQL Migration Dump\n';
        sqlDump += "-- Generated at: " + new Date().toISOString() + "\n\n";
        sqlDump += 'SET FOREIGN_KEY_CHECKS=0;\n\n';

        for (const table of tables) {
            console.log("\n🔄 Processing table: " + table);

            // 2. Get columns for the table
            const colsRes = await client.query("SELECT column_name, data_type, character_maximum_length, is_nullable, column_default FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 ORDER BY ordinal_position", [table]);

            const columns = colsRes.rows;

            // Generate CREATE TABLE
            let createSql = "CREATE TABLE IF NOT EXISTS `" + table + "` (\n";
            const colDefs = columns.map(col => {
                let def = "  `" + col.column_name + "` " + getMysqlType(col.data_type, col.character_maximum_length);
                if (col.is_nullable === 'NO') def += ' NOT NULL';
                return def;
            });

            // Auto-detect common primary key
            const hasId = columns.some(c => c.column_name === 'id');
            if (hasId) {
                colDefs.push('  PRIMARY KEY (`id`)');
            }

            createSql += colDefs.join(',\n') + '\n);\n\n';
            sqlDump += createSql;

            // 3. Get all data rows
            const dataRes = await client.query('SELECT * FROM "' + table + '"');
            const rows = dataRes.rows;
            console.log("   - Fetched " + rows.length + " rows");

            if (rows.length > 0) {
                const colNames = columns.map(c => "`" + c.column_name + "`").join(', ');

                let insertStatements = "INSERT INTO `" + table + "` (" + colNames + ") VALUES \n";

                const rowValues = rows.map(row => {
                    const vals = columns.map(col => escapeValue(row[col.column_name]));
                    return "  (" + vals.join(', ') + ")";
                });

                insertStatements += rowValues.join(',\n') + ';\n\n';
                sqlDump += insertStatements;
            }
        }

        sqlDump += 'SET FOREIGN_KEY_CHECKS=1;\n';

        const dumpPath = path.join(backupDir, 'supabase_to_mysql.sql');
        fs.writeFileSync(dumpPath, sqlDump);
        console.log("\n✅ Backup complete! File saved to: " + dumpPath);

    } catch (err) {
        console.error('\n❌ Error during backup process:');
        console.error(err);
    } finally {
        await client.end();
    }
}

runBackup();
