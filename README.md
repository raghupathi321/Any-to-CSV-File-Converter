

<h1>📂 Any-to-CSV File Converter</h1>

<p>
  A powerful and user-friendly tool to convert various file formats (Excel, JSON, XML, TXT, etc.) into CSV format — built as a <strong>Chrome Extension</strong> and a <strong>React-based Web App</strong>.
</p>

<p>🔗 <strong>Live Website:</strong> <a href="https://any-to-csv.netlify.app" target="_blank">https://any-to-csv.netlify.app</a></p>

<hr>

<h2>🚀 Features</h2>

<h3>✅ Chrome Extension</h3>
<ul>
  <li>Lightweight and fast</li>
  <li>Opens a compact UI in the browser's top-right corner</li>
  <li>Click “Open Converter” to launch a dedicated popup tab for file conversion</li>
  <li>Supports multiple file types for upload and conversion to CSV</li>
  <li>Built with a clean and responsive interface</li>
</ul>

<h3>✅ React Web App</h3>
<ul>
  <li>Fully responsive single-page application (SPA)</li>
  <li>Drag & Drop or file upload support</li>
  <li>Real-time file conversion with preview</li>
  <li>Downloads converted data as <code>.csv</code></li>
  <li>Hosted at <a href="https://any-to-csv.netlify.app" target="_blank">https://any-to-csv.netlify.app</a></li>
</ul>

<hr>

<h2>🧩 Chrome Extension Overview</h2>

<h3>🔧 Tech Stack</h3>
<ul>
  <li><strong>HTML</strong>, <strong>CSS</strong>, <strong>JavaScript</strong></li>
  <li><strong>Manifest V3</strong></li>
  <li>Uses <code>chrome.runtime</code> APIs for opening popup windows and handling file uploads</li>
</ul>

<h3>📂 Folder Structure</h3>
<pre><code>Any-to-CSV-File-Converter/
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
├── options.html
├── options.js
├── options.css
├── background.js
</code></pre>

<h3>🔄 How It Works</h3>
<ul>
  <li>Clicking the extension icon opens a minimal popup</li>
  <li>Clicking <strong>Open Converter</strong> opens a custom-styled window (600x500px) aligned to the top-right of your screen</li>
  <li>Users can upload files and download them as <code>.csv</code></li>
</ul>

<hr>

<h2>🌐 React Website Overview</h2>

<h3>🛠 Tech Stack</h3>
<ul>
  <li><strong>React JS</strong></li>
  <li><strong>Tailwind CSS</strong> (or your preferred styling)</li>
  <li><strong>FileReader API</strong></li>
  <li><strong>CSV conversion logic</strong> using JS libraries like <code>papaparse</code></li>
</ul>

<h3>📦 Key Features</h3>
<ul>
  <li>Drag & drop support for ease of use</li>
  <li>File format detection and automatic parsing</li>
  <li>Clean CSV preview and export functionality</li>
</ul>

<hr>

<h2>🧪 Running the Extension Locally</h2>

<ol>
  <li>Clone the repo:</li>
</ol>

<pre><code>git clone https://github.com/raghupathi321/Any-to-CSV-File-Converter.git
cd Any-to-CSV-File-Converter
</code></pre>

<ol start="2">
  <li>Open Chrome and navigate to:</li>
</ol>

<pre><code>chrome://extensions/</code></pre>

<ol start="3">
  <li>Enable <strong>Developer mode</strong> (top right)</li>
  <li>Click <strong>Load unpacked</strong> and select the extension folder</li>
</ol>

<hr>


<hr>

<h2>👨‍💻 Author</h2>

<p>Created by:</p>

<ul>
  <li><a href="https://github.com/BokkaDaivikReddy" target="_blank">Bokka Daivik Reddy</a> — Software Developer & Web Enthusiast</li>
  <li><a href="https://github.com/raghupathi321" target="_blank">Raghupathi321</a> — Software Developer & Web Enthusiast</li>
</ul>

<p>📩 Feel free to contribute, raise issues, or suggest new features!</p>

</body>
</html>
