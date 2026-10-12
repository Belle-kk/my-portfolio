
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");

function readJSON(filename) {
  return JSON.parse(
    fs.readFileSync(path.join(ROOT, "data", filename), "utf8")
  );
}

function writePage(template, data, outputPath) {
  const templatePath = path.join(ROOT, "views", template);
  const html = ejs.render(
    fs.readFileSync(templatePath, "utf8"),
    data,
    { filename: templatePath }
  );

  const target = path.join(DIST, outputPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html, "utf8");

  console.log(`Generated: ${outputPath}`);
}

function buildProjects(home, projects, template, prefix) {
  const ids = home.portfolios.map((item) => item.id);

  for (const id of ids) {
    if (!Object.prototype.hasOwnProperty.call(projects, id)) {
      throw new Error(`找不到專案資料：${prefix}/${id}`);
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      throw new Error(`專案 ID 格式不正確：${id}`);
    }
  }

  for (const id of Object.keys(projects)) {
    writePage(
      template,
      { project: projects[id] },
      path.join(prefix, id, "index.html")
    );
  }
}

function build() {
  const home = readJSON("home.json");
  const projects = readJSON("projects.json");
  const engineerHome = readJSON("engineer_home.json");
  const engineerProjects = readJSON("engineer_projects.json");

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  fs.cpSync(path.join(ROOT, "public"), DIST, {
    recursive: true
  });

  writePage("index.ejs", { profile: home }, "index.html");

  writePage(
    "engineer_index.ejs",
    { profile: engineerHome },
    "engineer/index.html"
  );

  buildProjects(
    home,
    projects,
    "project.ejs",
    "project"
  );

  buildProjects(
    engineerHome,
    engineerProjects,
    "engineer_project.ejs",
    "engineer/project"
  );

  console.log("\n✅ 靜態網站建置完成！");
}

try {
  build();
} catch (error) {
  console.error("\n❌ 建置失敗：", error.message);
  process.exitCode = 1;
}
