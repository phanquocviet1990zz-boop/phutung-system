const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
    keyFile: "service-account.json",
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: "v3", auth });

// Lấy danh sách mã hàng (folder)
async function getProductCodes() {
    const res = await drive.files.list({
        q: "'1BKbdxqNGvVbXOPaQXNR8gpMqPtwdgpHd' in parents",
        fields: "files(id, name, mimeType)",
    });

    return res.data.files;
}

// Lấy ảnh theo mã hàng
async function getImages(folderName) {
    const folderRes = await drive.files.list({
        q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
        fields: "files(id, name)",
    });

    if (folderRes.data.files.length === 0) return [];

    const folderId = folderRes.data.files[0].id;

    const imgRes = await drive.files.list({
        q: `'${folderId}' in parents`,
        fields: "files(id, name, mimeType)",
    });

    return imgRes.data.files.map(file => ({
        name: file.name,
        url: `https://lh3.googleusercontent.com/d/${file.id}=w1000`,
    }));
}

module.exports = {
    getProductCodes,
    getImages,
};