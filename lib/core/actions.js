const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const download = promisify(require("download-git-repo"));
const open = require("open");

const { vueRepo } = require("../config/repo-config");

const terminal = require("../utils/terminal");
const tools = require("../utils/tools");
const { name } = require("ejs");
const { Console } = require("console");

const createProject = async (project) => {
  console.log("Dinert helps you create you project~");

  // 1.clone项目
  await download(vueRepo, project, { clone: true });

  // 2. 执行npm install
  // console.log(process);
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  await terminal.spawn(npm, ["install"], { cwd: `./${project}` });

  // 3. 运行npm run serve
  await terminal.spawn(npm, ["run", "server"], { cwd: `./${project}` });

  // 4. 打开浏览器
  // open('http://localhost:8080/');
};

// createComponent
const addComponent = async (name, dest) => {
  // 1.编译ejs模板
  const result = await tools.compile("vue-conpoment.ejs", {
    name,
    className: name.toLowerCase(),
    lowerName: name.toLowerCase(),
  });

  // 2.解析ejs模板写入.vue文件中
  const targetPath = path.resolve(dest, `${name}.vue`);
  tools.writeFile(targetPath, result);
};

// 添加路由组件
const addRoute = async (dest, routerUrl, name) => {

  // 1. 编译ejs模板
  let upperName = name.replace(name[0], name[0].toUpperCase());
  const routeResult = await tools.compile("vue-router.ejs", {
    url: routerUrl,
    upperName
  });

  const targetRoutePath = path.resolve(dest, "index.ts");
  console.log(targetRoutePath);
  await tools.writeFile(targetRoutePath, routeResult);
};

// 创建所有的路由
const addAllRoute = async (dest, data) => {
  // 创建所有的路由文件
  for (let i = 0; i < data.length; i++) {
    const tempData = data[i];
    let mkdirUrl = tempData.url.replace("/", "").split("/");
    const type = tempData.type;
    let routerUrl = "";
    for (let i = 1; i < mkdirUrl.length; i++) {
      mkdirUrl[i] = mkdirUrl[i].replace(
        mkdirUrl[i][0],
        mkdirUrl[i][0].toLowerCase()
      );
    }
    const name = mkdirUrl[mkdirUrl.length - 1];
    mkdirUrl = mkdirUrl.join("/"); // 文件夹路径
    routerUrl = "/" + mkdirUrl; // 路由路径
    const url = path.resolve(dest, mkdirUrl);

    if (!fs.existsSync(url)) { // 判断文件夹是否存在，不存在则创建文件夹
      await fs.promises.mkdir(url);
      if(type === 2) {
        addRoute(url, routerUrl, name);
      }else {
        if(tempData.children && tempData.children) {
          addAllRoute(dest, tempData.children);
        }
      }
    }else {
      if(type === 2) {
        addRoute(url, routerUrl, name);
      }else {
        if(tempData.children && tempData.children) {
          addAllRoute(dest, tempData.children);
        }
      }
    }
  }
};


const addStore = async (name, dest) => {
  const storeResult = await tools.compile("vue-store.ejs", {});
  const typesResult = await tools.compile("vue-types.ejs", {});
  console.log(name);
  const targetPagePath = path.resolve(dest, `${name}.js`);
  const targetRoutePath = path.resolve(dest, "type.js");
  tools.writeFile(targetPagePath, storeResult);
  tools.writeFile(targetRoutePath, typesResult);
};

const addViews = async(dest, name) => {
   // 1. 编译ejs模板
   const ViewsResult = await tools.compile("vue-views.ejs", {
     name
   });
 
   const targetViewsPath = path.resolve(dest, "index.vue");
   console.log(targetViewsPath);
   await tools.writeFile(targetViewsPath, ViewsResult);
}

const addAllViews = async(dest, data) => {

    // 创建所有的视图文件
    for (let i = 0; i < data.length; i++) {
      const tempData = data[i];
      let mkdirUrl = tempData.url.replace("/", "").split("/");
      const type = tempData.type;
      for (let i = 0; i < mkdirUrl.length; i++) {
        mkdirUrl[i] = mkdirUrl[i].replace(
          mkdirUrl[i][0],
          mkdirUrl[i][0].toUpperCase()
        );
      }
      const name = mkdirUrl[mkdirUrl.length - 1];
      mkdirUrl = mkdirUrl.join("/"); // 文件夹路径
      const url = path.resolve(dest, mkdirUrl);
      console.log(url);
  
      if (!fs.existsSync(url)) { // 判断文件夹是否存在，不存在则创建文件夹
        await fs.promises.mkdir(url);
        if(type === 2) {
          addViews(url, name);
        }else {
          if(tempData.children && tempData.children) {
            addAllViews(dest, tempData.children);
          }
        }
      }else {
        if(type === 2) {
          addViews(url, name);
        }else {
          if(tempData.children && tempData.children) {
            addAllViews(dest, tempData.children);
          }
        }
      }
    }
}

module.exports = {
  createProject,
  addComponent,
  addRoute,
  addStore,
  addAllRoute,
  addViews,
  addAllViews
};
