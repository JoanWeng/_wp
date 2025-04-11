import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use((ctx) => {
  // ctx.response.status = 404
  console.log('url=', ctx.request.url)
  let pathname = ctx.request.url.pathname

  function page(body) {
    return `<html>
  <head>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: #f0f0f0;
      overflow: hidden;
      background-color: #1e1e1e;
      color: white;
    }

    .container {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 80%;
      height: 80%;
      background: linear-gradient(45deg, #ff6b6b, #ffd93d);
      border-radius: 20px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      animation: backgroundAnimation 5s ease infinite;
      text-align: center;
      padding: 20px;
    }

    @keyframes backgroundAnimation {
      0% {
        background: linear-gradient(45deg, #ff6b6b, #ffd93d);
      }
      50% {
        background: linear-gradient(45deg, #4e73df, #6c5ce7);
      }
      100% {
        background: linear-gradient(45deg, #ff6b6b, #ffd93d);
      }
    }

    h1 {
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    ol {
      list-style-type: none;
      padding: 0;
      margin: 20px 0;
    }

    li {
      margin: 10px 0;
    }

    a {
      text-decoration: none;
      color: white;
      font-weight: bold;
      font-size: 20px;
      transition: color 0.3s ease;
    }

    a:hover {
      color: #ffd93d;
    }

    .button {
      padding: 20px 40px;
      font-size: 18px;
      font-weight: bold;
      text-transform: uppercase;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      background-color: #ffffff;
      color: #1e1e1e;
      transition: transform 0.3s ease, background-color 0.3s ease;
      margin-top: 30px;
    }

    .button:hover {
      transform: scale(1.1);
      background-color: #ffd93d;
    }

    .floatingBackground {
      position: absolute;
      top: 10%;
      left: 10%;
      width: 200px;
      height: 200px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      animation: floatingAnimation 5s ease-in-out infinite;
    }

    @keyframes floatingAnimation {
      0% {
        transform: translate(0, 0);
      }
      50% {
        transform: translate(20px, 20px);
      }
      100% {
        transform: translate(0, 0);
      }
    }
  </style>
  </head>
  <body>
    <div class="container">
    <div class="floatingBackground"></div>
  ${body}
  </div>
  </body>
  </html>
  `
  }

  if (pathname == '/') {
    ctx.response.body = page(`

    <h1>我的自我介紹</h1>

    <!-- 自我介紹列表 -->
    <ol>
      <li><a href="/name">姓名</a></li>
      <li><a href="/age">年齡</a></li>
      <li><a href="/gender">性別</a></li>
    </ol>

    <!-- 點我按鈕 -->
    <button class="button" id="clickButton">點我</button>
  <script>
    // 使用事件監聽器來處理按鈕點擊事件
    document.getElementById("clickButton").addEventListener("click", function() {
      this.innerHTML = "別點了D:<";  // 改變按鈕文字
      this.style.backgroundColor = "#ff6b6b";  // 改變背景顏色
      this.style.cursor = "not-allowed";  // 改變光標樣式
      this.disabled = true;  // 禁用按鈕
    });
  </script>
  
`)
  } 
    else if (pathname == '/name')
    {
      ctx.response.body = page(`<p style="font-size:100px; font-family:Heiti TC;">翁喬恩</p>`)
    }
    else if (pathname == '/age')
    {
      ctx.response.body = page(`<p style="font-size:100px; font-family:Menlo">18</p>`)
    }
    else if (pathname == '/gender')
    {
      ctx.response.body = page('<p style="font-size:100px; font-family:Wingdings;">F</p>')
    }
  // ctx.response.body = 'Not Found!'
});

console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 })