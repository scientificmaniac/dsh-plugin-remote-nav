# 贡献指南

感谢你愿意改进这个插件。提交前请先阅读下面的约定。

## 语言约定

- **所有文档、提交说明、代码注释统一使用简体中文**（README、CHANGELOG、`docs/`、测试说明等）。
- 代码、命令、文件路径、变量名、API 名称等必须保持原样的内容使用英文。
- `locale/en.json` 是插件显示给英文界面的资源文件，不属于文档，保留英文。

## 开发环境

- Node.js ≥ 22（仅用于构建与测试，运行时不依赖任何第三方包）。
- Windows / macOS / Linux 均可开发；本插件主要面向 DSH 桌面端与 Web UI。
- 不需要 `npm install`：项目没有运行时依赖，测试直接使用 Node 内置能力。

## 开发流程

1. Fork 并克隆仓库。
2. 从 `main` 新建分支：`feat/xxx`、`fix/xxx`、`docs/xxx`。
3. 修改代码后执行：

   ```bash
   npm run build     # 重新生成 client.js
   npm test          # 寻路单测 + 客户端插件测试
   ```

4. 涉及交互 / DOM 的改动，建议在 `demo/behavior.html` 或 `demo/standalone.html` 中实际验证。
5. 提交时使用约定式前缀 + 中文说明，例如：

   ```
   feat: 输入框整卡作为一个导航目标
   fix: 修复打开会话后遥控器光标卡住
   docs: 补充返回键分层说明
   ```

6. 推送分支并发起 Pull Request，说明改动内容与验证方式。

## 代码约定

- 引擎（`src/remote-nav.js`）保持零依赖、纯 DOM 实现，新增纯函数优先补单测。
- 挂载所产生的监听器、定时器、DOM、样式都必须能被 `destroy()` 清理；DSH 插件卸载时依赖这一点。
- 文案统一走 `src/dsh-client.js` 中的字典（经宿主 locale 服务），不要在组件里硬编码多语言。
- 与 DSH 版本相关、靠 DOM 约定识别的位置（如 `[data-composer-card]`、`[data-disclosure-row]`）在 `docs/架构说明.md` 中记录。

## 构建产物

`client.js` 是仓库的一部分，必须随源码一起提交并被 DSH 安装流程直接使用：

- 改了 `src/` 后必须重新 `npm run build` 再提交；
- 不要手改构建产物，它由 `scripts/build.mjs` 生成。

## 文档

- 新增功能或改变行为时，同步更新 README、CHANGELOG 及 `docs/` 中相关说明。
- 文档里的相对链接请指向仓库内真实路径（如 `docs/images/hud.png`）。

## 许可证

提交贡献即表示同意以本仓库的 MIT 许可证发布你的改动。
