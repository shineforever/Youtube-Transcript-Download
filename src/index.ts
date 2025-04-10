import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 使用真实的接口地址
const API_URL = "https://api.mangatranslator.cc/v1/oversea-extension/subtitle/parseByUrl?url=";

// 接口：获取字幕
app.get('/api/parse-subtitle', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ code: 400, message: "Missing 'url' query parameter" });
    }

    try {
        // 请求字幕数据
        const response = await axios.get(`${API_URL}${url}`);
        const { data } = response;

        if (data.code === 0) {
            const { srt, title, url: videoUrl } = data.data;

            // 动态构建字幕信息
            const subtitles: { [key: string]: string } = {};

            // 检查 srt 和 vtt 格式
            if (srt) {
                Object.keys(srt).forEach(language => {
                    subtitles[language] = srt[language];
                });
            }

            if (data.data.vtt && Object.keys(data.data.vtt).length > 0) {
                // 如果有 vtt 格式，暂时处理为字幕链接
                Object.keys(data.data.vtt).forEach(language => {
                    subtitles[`${language} (vtt)`] = data.data.vtt[language];
                });
            }

            // 返回处理后的字幕数据
            res.json({
                code: 0,
                message: "Subtitles fetched successfully",
                data: {
                    title,
                    subtitle_urls: subtitles,
                    url: videoUrl
                }
            });
        } else {
            res.status(500).json({ code: 500, message: "Failed to fetch subtitles" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: "Internal server error" });
    }
});

app.listen(3000, () => {
    console.log("MCP Plugin 服务运行在 http://localhost:3000");
});
