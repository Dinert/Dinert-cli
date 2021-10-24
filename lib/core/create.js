const program = require("commander");
const fs = require('fs');
const path = require('path');

const { createProject, addComponent, addPageAndRoute, addAllPageRoute, addStore } = require("./actions");

const createCommands = () => {
    
  // 创建项目指令
  program
    .command("create <project> [others...]")
    .description("clone a repository into a folder")
    .action(createProject);

  // create Componet
  program
  .command('addcpn <name>')
  .description('add vue component，例如：Dinert addcpn HelloWrold -d src/components').
  action((name) => {
    const dest = program.opts().dest || 'src/components';
    addComponent(name, dest);
  });

  program
  .command('addpage <page>')
  .description('add vue page and rouer config，例如：Dinert addpage Home [-d src/page]')
  .action(async (name) => {
      let dest = program.opts().dest || 'src/views';
      if(name === 'all') {
        dest = path.resolve(dest);
        let url = 'public/json/router.json';
        addAllPageRoute(dest, url);
      }else {
        dest = path.resolve(dest, name);
      if(!fs.existsSync(dest)) {
        await fs.promises.mkdir(dest);
        addPageAndRoute(name, dest);
      }
    }

  });

  program
  .command('addstore <store>')
  .description('add vue store config，例如：Dinert addstore index -d src/store ')
  .action(async (name) => {
    let dest = program.opts().store || 'src/store';
       dest = path.resolve(dest, name);
       if(!fs.existsSync(dest)) {
        await fs.promises.mkdir(dest);
        addStore(name, dest);
       }
  });
};

module.exports = createCommands;
