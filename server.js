const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// 讀取行銷版資料
const homeData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'home.json'), 'utf8'));
const projectsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'projects.json'), 'utf8'));

// 讀取工程師版資料 (我們等一下會建立這兩個檔案)
const engineerHomeData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'engineer_home.json'), 'utf8'));
const engineerProjectsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'engineer_projects.json'), 'utf8'));

// ==========================================
// 📍 路由區 1：行銷企劃版 (預設首頁 /)
// ==========================================
app.get('/', (req, res) => {
    res.render('index', { profile: homeData });
});
app.get('/project/:id', (req, res) => {
    const projectDetail = projectsData[req.params.id];
    if (projectDetail) res.render('project', { project: projectDetail });
    else res.status(404).send('找不到該專案');
});

// ==========================================
// 📍 路由區 2：全端工程師版 (/engineer)
// ==========================================
app.get('/engineer', (req, res) => {
    res.render('engineer_index', { profile: engineerHomeData });
});
app.get('/engineer/project/:id', (req, res) => {
    const projectDetail = engineerProjectsData[req.params.id];
    if (projectDetail) res.render('engineer_project', { project: projectDetail });
    else res.status(404).send('找不到該技術專案');
});

app.listen(port, () => {
    console.log(`✅ 伺服器啟動成功： http://localhost:${port}`);
});