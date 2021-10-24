#!/usr/bin/env node

const program = require("commander");
const package = require("./package.json");
const options = program.opts();

// 查看版本号
program.version(package.version);

const helpOptions = require("./lib/core/help");
const createCommands = require("./lib/core/create");

// 帮助和可选信息
helpOptions();

// 创建其它指令
createCommands();

program.parse(process.argv);
