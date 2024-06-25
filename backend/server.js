const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/download', async (req, res) => {
    const { url, quality } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'No URL provided' });
    }

    const videoID = ytdl.getURLVideoID(url);
    const videoInfo = await ytdl.getInfo(videoID);
    const title = videoInfo.videoDetails.title.replace(/[\/\\?%*:|"<>]/g, '-');  // Sanitize the title
    const videoFormat = ytdl.chooseFormat(videoInfo.formats, { quality: `highest` });

    const output = path.join(__dirname, 'downloads', `${title}.mp4`);

    try {
        ytdl(url, { format: videoFormat })
            .pipe(fs.createWriteStream(output))
            .on('finish', () => {
                res.download(output, `${title}.mp4`, (err) => {
                    if (err) {
                        console.error('Error sending file:', err);
                    }
                    fs.unlink(output, (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        }
                    });
                });
            });
    } catch (err) {
        console.error('Error downloading video:', err);
        return res.status(500).json({ error: 'Error downloading video' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
