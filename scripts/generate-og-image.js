// This is a script to generate an Open Graph image
// You'll need to run: npm install puppeteer

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateOGImage() {
  console.log('Generating OG image...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
  });
  
  const page = await browser.newPage();
  
  // Set viewport to standard OG image size
  await page.setViewport({
    width: 1200,
    height: 630,
    deviceScaleFactor: 1,
  });
  
  // Basic HTML template for OG Image
  const html = `
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 1200px;
            height: 630px;
            background-color: #e9dfc1;
            font-family: 'Arial', sans-serif;
            position: relative;
            overflow: hidden;
          }
          
          .container {
            width: 90%;
            text-align: center;
          }
          
          .app-name {
            font-size: 72px;
            color: #1a3329;
            margin-bottom: 20px;
            font-style: italic;
          }
          
          .asterisk {
            color: #264135;
          }
          
          .tagline {
            font-size: 32px;
            color: #333;
            margin-bottom: 40px;
          }
          
          .feature {
            font-size: 24px;
            color: #555;
            margin: 10px 0;
          }
          
          .decoration {
            position: absolute;
            width: 300px;
            height: 300px;
            background: rgba(38, 65, 53, 0.1);
            border-radius: 50%;
          }
          
          .decoration-1 {
            top: -100px;
            left: -100px;
          }
          
          .decoration-2 {
            bottom: -100px;
            right: -100px;
          }
        </style>
      </head>
      <body>
        <div class="decoration decoration-1"></div>
        <div class="decoration decoration-2"></div>
        
        <div class="container">
          <div class="app-name">sub<span class="asterisk">*</span></div>
          <div class="tagline">Track Subscriptions, Save Money</div>
          
          <div class="feature">✓ Automatically detect transactions from emails</div>
          <div class="feature">✓ Track monthly expenses</div>
          <div class="feature">✓ Organize your spending</div>
        </div>
      </body>
    </html>
  `;
  
  await page.setContent(html);
  
  // Ensure the directory exists
  const dir = path.resolve(process.cwd(), 'public/images');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Save the screenshot
  const filePath = path.resolve(process.cwd(), 'public/images/og-image.png');
  await page.screenshot({ path: filePath });
  
  console.log(`OG image generated at: ${filePath}`);
  
  await browser.close();
}

generateOGImage().catch(console.error); 