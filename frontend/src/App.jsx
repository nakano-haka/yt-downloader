import React, { useState } from 'react';
import './App.css';
import youtubeLogo from './assets/youtube-logo.png'; // Make sure you have this logo in your project

const App = () => {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('720p');
  const [status, setStatus] = useState('');
  const [videoId, setVideoId] = useState('');

  const handleDownload = async () => {
    setStatus('ダウンロード中...');
    try {
      const response = await fetch('http://localhost:3000/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, quality }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = downloadUrl;
        a.download = `${url.split('=')[1]}.mp4`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        setStatus('ダウンロード完了!');
      } else {
        setStatus('エラー: ダウンロードに失敗しました。');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('エラー: ダウンロードに失敗しました。');
    }
  };
  

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setUrl(url);
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})|youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (match) {
      setVideoId(match[1] || match[2]);
    } else {
      setVideoId('');
    }
  };

  return (
    <div className="container">
      <header>
        <h1>
          <img src={youtubeLogo} alt="YouTube Logo" className="logo" />
          YouTubeビデオダウンローダー
        </h1>
        <p className="tagline">YouTubeからビデオを簡単にダウンロードすることができます。</p>
      </header>
      <main className="grid">
        <div className="instructions">
          <h2>ダウンロード手順</h2>
          <ol>
            <li>YouTubeのURLをコピーします。</li>
            <li>URLを入力フィールドに貼り付けます。</li>
            <li>ダウンロード品質を選択し、「ダウンロード」ボタンをクリックします。</li>
          </ol>
        </div>
        <div className="input-section">
          <input 
            type="text" 
            placeholder="YouTubeのURLを入力してください" 
            value={url} 
            onChange={handleUrlChange} 
          />
          <select value={quality} onChange={(e) => setQuality(e.target.value)}>
            <option value="360p">360p</option>
            <option value="480p">480p</option>
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
            <option value="1440p">1440p</option>
            <option value="2160p">2160p (4K)</option>
          </select>
          <button onClick={handleDownload}>ダウンロード</button>
        </div>
      </main>
      <div id="status">{status}</div>
      <div className="preview">
        {videoId ? (
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}`} 
            title="YouTube video preview" 
            allowFullScreen 
          ></iframe>
        ) : (
          <div className="placeholder">プレビュー</div>
        )}
      </div>
    </div>
  );
};

export default App;
