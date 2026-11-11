/**
 * 宿主侧入口（Cordis apply）。
 *
 * 遥控器导航完全运行在 Web UI 客户端：client.js 由 bundle 的 `dsh.client` 声明加载，
 * 在页面里挂载键盘监听、高亮层、HUD 和侧边栏开关按钮。
 *
 * 宿主这一行只负责让本 bundle 在插件清单里有一个可管理的插件行；
 * 它不开服务、不碰 profile 配置，也不依赖任何宿主服务。
 */
export function apply() {}
