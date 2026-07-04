const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;; //如果雲端平台有給 Port 就用雲端的，如果在自己電腦上測試就用 3000

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// 讀取資料
const homeData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'home.json'), 'utf8'));
const projectsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'projects.json'), 'utf8'));

// 路由 1：主首頁
app.get('/', (req, res) => {
    res.render('index', { profile: homeData });
});

// 路由 2：動態專案內頁 (利用 :id 來決定顯示哪個專案)
app.get('/project/:id', (req, res) => {
    const projectId = req.params.id; // 例如取得 'shuguo'
    const projectDetail = projectsData[projectId];

    if (projectDetail) {
        res.render('project', { project: projectDetail });
    } else {
        res.status(404).send('找不到該專案');
    }
});

app.listen(port, () => {
    console.log(`✅ 伺服器啟動成功： http://localhost:${port}`);
});