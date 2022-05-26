const fs = require("fs").promises;
const path = require("path");

async function main() {
    const salesDir = path.join(__dirname, "stores");
    const salesTotalsDir = path.join(__dirname, "salesTotals")

    try {
        await fs.mkdir(salesTotalsDir);
    } catch {
        console.log(`${salesTotalsDir} already exists.`)
    } 

    const salesFiles = await findSalesFilesV2(salesDir);
    const salesTotal = await calculateSalesTotal(salesFiles);

    const report = {
        salesTotal, 
        totalStores: salesFiles.length,
    };

    const reportPath = path.join(salesTotalsDir, "report.json");

    try {
        await fs.unlink(reportPath);
    } catch {
        console.log(`Failed to remove ${reportPath}`);   
    }

    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`Sales report written to ${salesTotalsDir}`)
}
main()

async function findSalesFiles(folderName) {
    const storeFiles = await fs.readdir(folderName);
    console.log(storeFiles);
}

async function findSalesFilesV2(folderName) {
    let salesFiles = [];
    const items = await fs.readdir(folderName, {withFileTypes: true});

    for (const item of items) {
        if (item.isDirectory()) {
            salesFiles = salesFiles.concat(
                await findSalesFilesV2(path.join(folderName, item.name))
            );
        } else {
            if (path.extname(item.name) === ".json") {
                salesFiles.push(path.join(folderName, item.name));
            }
        }
    }

    return salesFiles;
}

async function calculateSalesTotal(salesFiles){
    let salesTotal = 0;
    for (file of salesFiles){
        const data = JSON.parse(await fs.readFile(file));
        salesTotal += data.total;
    }
    return salesTotal;
}


// const items = await fs.readdir("stores");
// console.log(items);

// const items2 = await fs.readdir("stores", {withFileTypes: true});
// for (let item of items) {
//     const type = item.isDirectory() ? "folder" : "file";
//     console.log(`${item.name}: ${type}`);
// }

// function findFiles(folderName) {
//     const items = await fs.readdir(folderName, {withFileTypes: true});
//     items.forEach((item) => {
//         if (path.extname(item.name) === ".json") {
//             console.log(`Found file: ${item.name} in folder: ${folderName}`);
//         } else {
//             // this is a folder, so call this method again and pass
//             // the path to the folder
//             findFiles(path.join(folderName, item.name));
//         }
//     });
// }
