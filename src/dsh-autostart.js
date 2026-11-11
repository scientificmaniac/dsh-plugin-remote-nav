/**
 * dsh-autostart.js — 浏览器侧启动引导（DeepSeek Harness Web UI）
 *
 * 职责：
 *   1. 幂等挂载 RemoteNav（核心逻辑见 remote-nav.js，本文件不含寻路代码）
 *   2. 遥控器「菜单键 / F9」切换导航模式
 *   3. TV 场景的常驻 HUD（模式状态 + 操作提示）
 *   4. 诊断工具 diagnose()：打印候选元素分布，用于适配真实 DSH 的 DOM
 *   5. 配置持久化（localStorage）
 *   6. 可逆：destroy() 精确移除本文件注册的监听器 / HUD / 样式，供 DSH 插件卸载时调用
 *
 * 本文件不自动执行：只有 DSH 客户端插件（client.js）会调用 boot() 完成挂载，
 * 并在插件卸载时调用 destroy()。
 */
import { createRemoteNav } from './remote-nav.js';

const STORAGE_KEY = 'dsh:remoteNav:config';
const STYLE_ATTR = 'data-dsh-remote-nav';

export const UI_DEFAULTS = {
  wrap: false, // 边界停住 / 循环
  entry: 'top-left',
  scrollFollow: true,
  highlightPadding: 5,
  pauseWhileEditing: true,
  leaveEditingOnArrow: true, // 输入框里按方向键先退出输入，避免光标看起来卡住
  scrollColumnLock: true, // 滚动过会话正文后，上下键锁在本列，到底也不跳到别的列
  toggleKeys: ['ContextMenu', 'F9'], // 遥控器菜单键 / 键盘 F9
  toggles: [82, 93], // 老 keyCode：82=MENU，93=CONTEXT_MENU
  autoEnableOn: ['?remote=1', '?remote=1&'], // URL 命中即自动开启（TV 快捷方式用）
  hud: true,
  extraSelector: '', // 真实 DSH 里可交互但不符合默认选择器时，追加这里
  root: null, // 限定扫描范围，如 '.chat-main'
};

/** localStorage 里只存可序列化的配置，样式文本之类的一次性参数不落盘 */
const PERSISTENT_KEYS = [
  'wrap',
  'entry',
  'scrollFollow',
  'highlightPadding',
  'pauseWhileEditing',
  'leaveEditingOnArrow',
  'scrollColumnLock',
  'toggleKeys',
  'toggles',
  'autoEnableOn',
  'hud',
  'extraSelector',
  'root',
];

function loadConfig() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {};
  } catch (_) {
    saved = {};
  }
  return Object.assign({}, UI_DEFAULTS, saved);
}

function saveConfig(cfg) {
  const out = {};
  for (const key of PERSISTENT_KEYS) {
    if (cfg[key] !== undefined) out[key] = cfg[key];
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
  } catch (_) {
    /* 隐私模式下忽略 */
  }
}

/** 菜单键识别 */
function isMenuKey(e, cfg) {
  if (cfg.toggleKeys.indexOf(e.key) >= 0) return true;
  const lc = e.keyCode || e.which;
  return cfg.toggles.indexOf(lc) >= 0;
}

/* ------------------------------------------------------------------ */
/* HUD + 样式                                                          */
/* ------------------------------------------------------------------ */

function createHud() {
  const el = document.createElement('div');
  el.className = 'dsh-remote-nav-hud';
  el.setAttribute('data-remote-nav-ignore', '');
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML =
    '<b>遥控器导航</b><span class="dsh-rn-state">已开启</span>' +
    '<i class="dsh-rn-tip">↑↓←→ 移动 / 长按滚动 · OK 确认 · 返回 退出 · 菜单 切换</i>';
  document.body.appendChild(el);
  return el;
}

/**
 * 注入本插件的样式表。页面上已有同源样式（例如同时装了 userscript）时不重复注入。
 * @returns {HTMLStyleElement | null} 本次创建的 style，destroy 时只移除自己创建的那个。
 */
function createStyle(css) {
  if (!css) return null;
  const existing = document.querySelector(`style[${STYLE_ATTR}]`);
  if (existing) return null;
  const style = document.createElement('style');
  style.setAttribute(STYLE_ATTR, '');
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
  return style;
}

/* ------------------------------------------------------------------ */
/* 引导                                                                */
/* ------------------------------------------------------------------ */

/**
 * 挂载遥控器导航。
 * @param {object} [overrides] 一次性覆盖配置；`css` 为要注入的样式表文本（不持久化）。
 * @returns {object} dshNav API，含 destroy()。
 */
export function boot(overrides = {}) {
  if (window.__dshRemoteNav) return window.__dshRemoteNav;

  const { css, ...cfgOverrides } = overrides;
  const cfg = Object.assign(loadConfig(), cfgOverrides);
  const style = createStyle(css);

  const nav = createRemoteNav({
    wrap: cfg.wrap,
    entry: cfg.entry,
    scrollFollow: cfg.scrollFollow,
    highlightPadding: cfg.highlightPadding,
    pauseWhileEditing: cfg.pauseWhileEditing,
    leaveEditingOnArrow: cfg.leaveEditingOnArrow,
    scrollColumnLock: cfg.scrollColumnLock,
    root: cfg.root ? document.querySelector(cfg.root) : null,
  });

  // 默认选择器作为基线，extraSelector 只做追加（不覆盖）
  const BASE_SELECTOR = nav.opts.selector;
  const applyExtraSelector = (extra) => {
    nav.opts.selector = extra ? `${BASE_SELECTOR},${extra}` : BASE_SELECTOR;
    nav.refresh();
  };
  applyExtraSelector(cfg.extraSelector);

  const hud = cfg.hud ? createHud() : null;

  function syncHud() {
    if (!hud) return;
    hud.style.display = nav.enabled ? 'block' : 'none';
    const state = hud.querySelector('.dsh-rn-state');
    if (state) state.textContent = nav.enabled ? (nav.opts.wrap ? '循环' : '停住') : '';
  }

  function setEnabled(on) {
    on ? nav.enable() : nav.disable();
    syncHud();
  }

  /* --- 常驻的菜单键监听（模式关闭时也能开启） --- */
  const onMenuKey = (e) => {
    if (!isMenuKey(e, cfg)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    e.preventDefault();
    e.stopPropagation();
    setEnabled(!nav.enabled);
  };
  window.addEventListener('keydown', onMenuKey, true);

  /* --- 业务侧可能主动重新聚焦输入框：保持 HUD 状态一致 --- */
  const onEnter = () => syncHud();
  const onLeave = () => syncHud();
  nav.on('enter', onEnter);
  nav.on('leave', onLeave);

  /* --- URL 参数自动开启（TV 桌面快捷方式 / kiosk） --- */
  if (cfg.autoEnableOn.some((q) => location.search.indexOf(q) >= 0)) setEnabled(true);

  /* --- 诊断 --- */
  function diagnose() {
    const sel = nav.opts.selector;
    const all = Array.from(document.querySelectorAll(sel));
    const visible = all.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 1 && r.height > 1;
    });
    const byTag = {};
    for (const el of visible) byTag[el.tagName.toLowerCase()] = (byTag[el.tagName.toLowerCase()] || 0) + 1;
    const report = {
      url: location.href,
      enabled: nav.enabled,
      candidatesTotal: all.length,
      candidatesVisible: visible.length,
      byTag,
      hasComposer: !!document.querySelector('textarea,[contenteditable="true"]'),
      current: nav.current ? nav.current.tagName + '.' + nav.current.className : null,
      config: cfg,
      sample: visible.slice(0, 12).map((el) => ({
        tag: el.tagName.toLowerCase(),
        role: el.getAttribute('role'),
        text: (el.textContent || '').trim().slice(0, 24),
        rect: (() => {
          const r = el.getBoundingClientRect();
          return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)].join(',');
        })(),
      })),
    };
    if (console.table) {
      console.log('%c[remote-nav] 候选元素统计', 'color:#1677ff;font-weight:bold', byTag);
      console.table(report.sample);
    }
    console.log('[remote-nav] 完整报告 →', report);
    return report;
  }

  let destroyed = false;

  const api = {
    nav,
    config: cfg,
    boot,
    enable: () => setEnabled(true),
    disable: () => setEnabled(false),
    toggle: () => setEnabled(!nav.enabled),
    diagnose,
    set(key, value) {
      cfg[key] = value;
      saveConfig(cfg);
      if (key === 'wrap') nav.opts.wrap = !!value;
      if (key === 'entry') nav.opts.entry = value;
      if (key === 'scrollFollow') nav.opts.scrollFollow = !!value;
      if (key === 'highlightPadding') nav.opts.highlightPadding = Number(value) || 5;
      if (key === 'extraSelector') applyExtraSelector(value);
      if (key === 'leaveEditingOnArrow') nav.opts.leaveEditingOnArrow = !!value;
      if (key === 'scrollColumnLock') nav.opts.scrollColumnLock = !!value;
      if (key === 'scrollStep') nav.opts.scrollStep = Math.max(8, Number(value) || 48);
      if (key === 'scrollAccelerate') nav.opts.scrollAccelerate = !!value;
      if (key === 'scrollAccelMax') nav.opts.scrollAccelMax = Math.max(1, Number(value) || 3);
      if (key === 'scrollAccelRampMs') nav.opts.scrollAccelRampMs = Math.max(100, Number(value) || 900);
      syncHud();
      return cfg;
    },
    /** 卸载：移除监听器 / HUD / 样式 / 全局别名，可重复调用 */
    destroy() {
      if (destroyed) return;
      destroyed = true;
      window.removeEventListener('keydown', onMenuKey, true);
      nav.off('enter', onEnter);
      nav.off('leave', onLeave);
      try {
        nav.destroy();
      } catch (err) {
        console.error('[remote-nav] nav.destroy 失败', err);
      }
      if (hud && hud.parentNode) hud.parentNode.removeChild(hud);
      if (style && style.parentNode) style.parentNode.removeChild(style);
      if (window.__dshRemoteNav === api) delete window.__dshRemoteNav;
      if (window.dshNav === api) delete window.dshNav;
    },
  };

  window.__dshRemoteNav = api;
  window.dshNav = api; // 便捷别名，控制台直接 dshNav.diagnose()
  syncHud();
  console.info(
    '%c[remote-nav] 已注入',
    'color:#1677ff;font-weight:bold',
    '\n  菜单键/F9 切换模式 · window.dshNav.diagnose() 查看候选元素分布'
  );
  return api;
}

export default boot;
