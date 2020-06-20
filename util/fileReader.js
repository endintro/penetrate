const fs = require("fs");

exports.readFile = async (options) => {
    let offset = 0;
    let fileChunks = [];

    const reader = fs.createReadStream(options.filepath, {
        highWaterMark: options.highWaterMark,
    });

    reader.on("data", (chunk) => {
        const head = Buffer.from(offset.toString().padStart(10, "0"));
        fileChunks[offset] = head + chunk;
        offset++;
    });

    return await new Promise((resolve) => {
        reader.on("end", () => {
            console.log(`文件读取完毕:${fileChunks.length} chunks`);
            resolve(fileChunks);
        });
    });
};
