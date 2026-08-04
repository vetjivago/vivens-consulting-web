const fs = require('fs');

const dump = JSON.parse(fs.readFileSync('backup_banco_dados/full_dump.json', 'utf8'));

let phpScript = `<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config.php';

try {
    $pdo->exec("SET FOREIGN_KEY_CHECKS=0;");
`;

for (const [table, rows] of Object.entries(dump)) {
    if (rows.length === 0) continue;

    const columns = Object.keys(rows[0]);
    let sql = `    $pdo->exec(<<<SQL\nINSERT IGNORE INTO \`${table}\` (\`${columns.join('`, `')}\`) VALUES\n`;

    const values = rows.map(row => {
        const rowVals = columns.map(col => {
            const val = row[col];
            if (val === null || val === undefined) return 'NULL';
            if (typeof val === 'number' || typeof val === 'boolean') return val;
            if (typeof val === 'object') return "'" + JSON.stringify(val).replace(/'/g, "''") + "'";
            return "'" + String(val).replace(/'/g, "''") + "'";
        });
        return `        (${rowVals.join(', ')})`;
    });

    sql += values.join(',\n') + ';\nSQL\n    );\n';
    phpScript += sql + '\n';
}

phpScript += `
    $pdo->exec("SET FOREIGN_KEY_CHECKS=1;");
    echo "Full data imported successfully.";
} catch (\\PDOException $e) {
    echo "Error importing data: " . $e->getMessage();
}
`;

fs.writeFileSync('api/import_full_data.php', phpScript);
console.log('Generated api/import_full_data.php');
