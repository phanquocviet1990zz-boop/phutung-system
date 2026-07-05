const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { getProductCodes, getImages } = require("./services/googleDrive");
const app = express();
const PORT = 3000;

// ======= THƯ MỤC ẢNH GỐC =======

let productCodes = [];

async function loadProductCodes() {
    const folders = await getProductCodes();
    productCodes = folders.map(f => f.name);
    console.log("Đã nạp", productCodes.length, "mã hàng từ Google Drive");
}

loadProductCodes();

app.use(cors());
app.use(express.static(path.join(__dirname, "../frontend")));

// Cho phép trình duyệt đọc ảnh


// Trang chủ
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// API tìm kiếm
app.get("/api/search", async (req, res) => {

    const code = (req.query.code || "").trim();

    if (!code) {
        return res.json({
            success: false,
            message: "Chưa nhập mã hàng"
        });
    }

    const images = await getImages(code);

    if (images.length === 0) {
        return res.json({
            success: false,
            message: "Không tìm thấy mã hàng"
        });
    }

    res.json({
        success: true,
        code,
        images: images.map(i => i.url)
    });

});

// =============================
// Gợi ý mã hàng
// =============================
app.get("/api/suggest", (req, res) => {

    const keyword = (req.query.keyword || "")
        .trim()
        .toLowerCase();

    if (!keyword) {
        return res.json([]);
    }

    const result = productCodes.filter(code =>
        code.toLowerCase().includes(keyword)
    );

    res.json(result.slice(0, 20));

});



app.get("/api/suggest",(req,res)=>{

const keyword=(req.query.keyword||"").toLowerCase();

const result=productCodes.filter(code=>
code.toLowerCase().includes(keyword)
);

res.json(result.slice(0,20));

});


app.listen(PORT, () => {
    console.log("Server chạy tại:");
    console.log("http://localhost:3000");
});