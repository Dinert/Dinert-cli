const program = require("commander");
const fs = require("fs");
const path = require("path");
const tools = require("../utils/tools");

const {
  createProject,
  addComponent,
  addRoute,
  addAllRoute,
  addStore,
  addViews,
  addAllViews
} = require("./actions");

const createCommands = () => {
  // 创建项目指令
  program
    .command("create <project> [others...]")
    .description("clone a repository into a folder")
    .action(createProject);

  // create Componet
  program
    .command("addcpn <name>")
    .description(
      "add vue component，例如：Dinert addcpn HelloWrold -d src/components"
    )
    .action((name) => {
      const dest = program.opts().dest || "src/components";
      addComponent(name, dest);
    });

  program
    .command("addview <view>")
    .description(
      "add vue view and rouer config，例如：Dinert addview Home [-d src/page]"
    )
    .action(async (name) => {
      let dest = program.opts().dest || "src/views/";
      if (name === "all") {
        dest = path.resolve(dest);
        let url = "public/json/menu.json";
        const res = await JSON.parse((await tools.readFile(url)).toString());
        const data = res.data;
        addAllViews(dest, data);
      }
    });

  program
    .command("addstore <store>")
    .description(
      "add vue store config，例如：Dinert addstore index -d src/store "
    )
    .action(async (name) => {
      let dest = program.opts().store || "src/store";
      dest = path.resolve(dest, name);
      if (!fs.existsSync(dest)) {
        await fs.promises.mkdir(dest);
        addStore(name, dest);
      }
    });

  // 创建路由文件
  program
    .command("addrouter <router>")
    .description(
      "add vue router config，例如：Dinert addrouter index -d src/router "
    )
    .action(async (name) => {
      let dest = program.opts().router || "src/router/";
      if (name === "all") {
        dest = path.resolve(dest);
        let url = "public/json/menu.json";
        const res = await JSON.parse((await tools.readFile(url)).toString());
        const data = res.data;
        addAllRoute(dest, data);
      } else {
        // dest = path.resolve(dest, name);
        // if (!fs.existsSync(dest)) {
        //   await fs.promises.mkdir(dest);
        //   addRoute(name, dest);
        // }
      }
    });


};

module.exports = createCommands;
