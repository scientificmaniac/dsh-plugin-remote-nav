/*! dsh-plugin-remote-nav v1.3.0-beta.1 — 遥控器/方向键空间导航 · 自动生成，勿手改（源文件在 src/） */
window.__ModuleLoader__.load({
  id: "dsh-plugin-remote-nav",
  factory(require) {
    const React = require('react');
    const __CSS__ = "/* remote-nav.css — 遥控器空间导航高亮样式（零依赖） */\r\n\r\n.remote-nav-highlight {\r\n  position: fixed;\r\n  left: 0;\r\n  top: 0;\r\n  width: 0;\r\n  height: 0;\r\n  z-index: 2147483000;\r\n  pointer-events: none; /* 绝不拦截鼠标/触摸 */\r\n  box-sizing: border-box;\r\n  border-radius: 10px;\r\n  /* 三层视觉：外发光 + 实心描边 + 内描边，保证在任何背景上都\"明显\" */\r\n  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.95), 0 0 0 4px #1677ff, 0 0 18px 4px rgba(22, 119, 255, 0.55),\r\n    inset 0 0 0 1px rgba(255, 255, 255, 0.35);\r\n  background: rgba(22, 119, 255, 0.1);\r\n  transition: transform 120ms ease-out, width 120ms ease-out, height 120ms ease-out;\r\n  will-change: transform;\r\n}\r\n\r\n.remote-nav-highlight[hidden] {\r\n  display: none !important;\r\n}\r\n\r\n/* 边界回弹反馈 */\r\n.remote-nav-highlight.is-bounce {\r\n  animation: remote-nav-bounce 220ms ease-out;\r\n}\r\n\r\n@keyframes remote-nav-bounce {\r\n  0% {\r\n    filter: brightness(1);\r\n  }\r\n  30% {\r\n    filter: brightness(1.6) saturate(1.4);\r\n  }\r\n  100% {\r\n    filter: brightness(1);\r\n  }\r\n}\r\n\r\n/* 模式开启时的全局微调：隐藏原生 focus ring，避免与高亮框\"双框\" */\r\nhtml.remote-nav-on :focus:not(input):not(textarea):not(select):not([contenteditable='true']) {\r\n  outline: none !important;\r\n}\r\n\r\n/* 尊重系统\"减少动态效果\"偏好 */\r\n@media (prefers-reduced-motion: reduce) {\r\n  .remote-nav-highlight {\r\n    transition: none;\r\n  }\r\n  .remote-nav-highlight.is-bounce {\r\n    animation: none;\r\n  }\r\n}\r\n\r\n/* ------------------------------------------------------------------ */\r\n/* DSH 侧边栏脚部的开关按钮（client.js 注册的 slot 组件）               */\r\n/* ------------------------------------------------------------------ */\r\n\r\n.dsh-remote-nav-btn {\r\n  display: inline-flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  flex: none;\r\n  width: 30px;\r\n  height: 30px;\r\n  padding: 0;\r\n  border: 1px solid transparent;\r\n  border-radius: 8px;\r\n  background: transparent;\r\n  color: inherit;\r\n  cursor: pointer;\r\n  transition: background-color 120ms ease-out, color 120ms ease-out;\r\n}\r\n\r\n.dsh-remote-nav-btn:hover {\r\n  background: var(--dsw-alias-bg-layer-2, rgba(127, 127, 127, 0.14));\r\n}\r\n\r\n.dsh-remote-nav-btn.is-on {\r\n  color: var(--dsw-alias-brand-primary, #1677ff);\r\n  background: var(--dsw-alias-bg-layer-2, rgba(127, 127, 127, 0.14));\r\n}\r\n\r\n.dsh-remote-nav-btn:focus-visible {\r\n  outline: 2px solid var(--dsw-alias-brand-primary, #1677ff);\r\n  outline-offset: 1px;\r\n}\r\n\r\n/* 状态文案只给读屏软件，按钮视觉上只有 D-pad 图标 */\r\n.dsh-remote-nav-btn-tip {\r\n  position: absolute;\r\n  width: 1px;\r\n  height: 1px;\r\n  margin: -1px;\r\n  padding: 0;\r\n  overflow: hidden;\r\n  clip-path: inset(50%);\r\n  white-space: nowrap;\r\n  border: 0;\r\n}\r\n\r\n/* 导航模式下由虚拟光标接管，按钮的 hover 底色不应再参与视觉反馈 */\r\nhtml.remote-nav-on .dsh-remote-nav-btn:hover {\r\n  background: transparent;\r\n}\r\n\r\n/* ------------------------------------------------------------------ */\r\n/* TV 场景常驻 HUD（dsh-autostart.js 注入）                             */\r\n/* ------------------------------------------------------------------ */\r\n\r\n.dsh-remote-nav-hud {\r\n  position: fixed;\r\n  right: 18px;\r\n  bottom: 18px;\r\n  z-index: 2147483001;\r\n  display: none; /* 由 JS 控制，只在模式开启时显示 */\r\n  max-width: 320px;\r\n  padding: 10px 14px;\r\n  border-radius: 12px;\r\n  background: rgba(17, 24, 39, 0.9);\r\n  color: #fff;\r\n  font: 12px/1.7 -apple-system, 'Segoe UI', 'Microsoft YaHei', system-ui, sans-serif;\r\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);\r\n  pointer-events: none;\r\n  backdrop-filter: blur(6px);\r\n}\r\n\r\n.dsh-remote-nav-hud b {\r\n  font-size: 13px;\r\n  letter-spacing: 0.02em;\r\n}\r\n\r\n.dsh-remote-nav-hud .dsh-rn-state {\r\n  margin-left: 8px;\r\n  padding: 1px 8px;\r\n  border-radius: 999px;\r\n  background: #1677ff;\r\n  font-size: 11px;\r\n}\r\n\r\n.dsh-remote-nav-hud .dsh-rn-tip {\r\n  display: block;\r\n  margin-top: 4px;\r\n  color: rgba(255, 255, 255, 0.72);\r\n  font-style: normal;\r\n}\r\n";

    /**
     * remote-nav.js — 遥控器 / 方向键「空间导航」模式（Web / DOM 环境）
     *
     * 设计要点
     *  1. 虚拟光标（overlay 高亮），不改动业务 DOM 结构、不写 tabindex，React/Vue 重渲染安全。
     *  2. 焦点顺序完全由「屏幕几何位置」计算，与 DOM 顺序无关。
     *  3. 模式关闭时零拦截：keydown 监听器在首行直接 return，鼠标/键盘行为与原来完全一致。
     *  4. MutationObserver 监听增删改，候选集合惰性重建，支持动态新增元素。
     *  5. 边界停住 / 循环可配置；滚动自动跟随。
     *
     * 零依赖，ESM： import { createRemoteNav } from './remote-nav.js'
     */

    /* ------------------------------------------------------------------ */
    /* 默认值                                                              */
    /* ------------------------------------------------------------------ */

    const DEFAULT_SELECTOR = [
      'a[href]',
      'button',
      'input:not([type="hidden"])',
      'select',
      'textarea',
      'summary',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]',
      '[role="link"]',
      '[role="tab"]',
      '[role="menuitem"]',
      '[role="option"]',
      '[role="switch"]',
      '[role="radio"]',
      '[contenteditable="true"]',
      '[data-remote-nav]',
      // 会话输入框：整张输入卡片算一个目标（内部的文字输入区不再单独入选，见 composerInputSelector）
      '[data-composer-card]',
    ].join(',');

    const DEFAULTS = {
      enabled: false,
      autoEnable: false,

      /* --- 候选元素 --- */
      selector: DEFAULT_SELECTOR,
      ignoreSelector: '[data-remote-nav-ignore]',
      // 只跳过元素本身、不连带子元素的候选排除（例：聊天里的“思考/运行命令”展开行）
      skipSelector: '[data-disclosure-row]',
      // 输入框分组：整张输入卡片算一个目标，卡片内部的文字输入区不再单独入选
      composerCardSelector: '[data-composer-card]',
      composerInputSelector: '[data-composer-input]',
      root: null, // 默认 document.body

      /* --- 寻路 --- */
      entry: 'top-left', // 无焦点时首个焦点：'top-left' | 'center' | 'dom-first'
      crossAxisWeight: 2.2, // 副轴（不对齐）距离权重
      alignmentSlack: 64, // 副轴对齐容差(px)：容器内元素允许的错位量
      minOverlapRatio: 0.18, // 主轴投影重叠比例下限，用于判定"正前方"

      /* --- 边界 --- */
      wrap: false, // false=边界停住（含回弹反馈），true=循环
      wrapCrossSlack: 96, // 循环时优先跳回"同一行/同一列"的容差

      /* --- 边界滚动（长按加速） --- */
      scrollOnBoundary: true, // 该方向没有候选时，滚动最近的会话滚动区
      conversationScrollSelector: '[data-conversation-scroll]',
      scrollStep: 48, // 首次按键滚动距离(px)
      scrollAccelerate: true, // 长按加速
      scrollAccelMax: 3, // 加速上限倍数
      scrollAccelRampMs: 900, // 从 1x 加速到上限所需的按住时长(ms)
      scrollHoldGapMs: 220, // 两次按键间隔超过它就算重新开始按住

      /* --- 滚动跟随 --- */
      scrollFollow: true,
      scrollMargin: 32, // 焦点与可视区边缘的最小留白
      scrollBehavior: 'smooth', // 'smooth' | 'auto'
      scrollContainer: null, // HTMLElement | (el)=>HTMLElement | null(自动找最近滚动祖先)

      /* --- 高亮 --- */
      overlay: true,
      highlightPadding: 5,
      highlightClassName: 'remote-nav-highlight',
      markElement: false, // true 时给当前元素加 data-remote-nav-current（有 React 风险，默认关）

      /* --- 键位 / 交互冲突 --- */
      pauseWhileEditing: true, // 真实焦点在输入框时，方向键先退出输入（遥控器场景）
      leaveEditingOnArrow: true, // 输入框里按方向键：先 blur 交给导航（设 false 则保留原生光标移动）
      repeatGuardMs: 45, // 遥控器连发去抖(ms)
      stopPropagation: true, // 拦截后阻止事件继续冒泡，避免业务侧二次响应
      escape: 'exit', // 'exit' | 'ignore'：返回键分层（退出输入 → 关弹层 → 退出导航）
      escapeConsume: false, // 退出导航模式时是否阻止 Esc 传下去（默认让页面也能收到）
      overlaySelector: '[role="dialog"],[role="alertdialog"],[role="menu"],[role="listbox"]', // 返回键要关掉的弹层
      toggleKey: null, // 例如 'F9'
      syncOnPointer: true, // 点击后同步虚拟光标
      activation: 'auto', // 'auto'(表单→focus，其它→click) | 'click' | 'focus'
    };

    /* ------------------------------------------------------------------ */
    /* 工具函数                                                            */
    /* ------------------------------------------------------------------ */

    const EPS = 0.5;

    /** 方向键识别（兼容标准浏览器 + 电视/WebView 的非常规 key 名 + 老 keyCode） */
    function directionOf(e) {
      switch (e.key) {
        case 'ArrowUp':
        case 'Up':
        case 'UpArrow':
          return 'up';
        case 'ArrowDown':
        case 'Down':
        case 'DownArrow':
          return 'down';
        case 'ArrowLeft':
        case 'Left':
        case 'LeftArrow':
          return 'left';
        case 'ArrowRight':
        case 'Right':
        case 'RightArrow':
          return 'right';
        default:
          break;
      }
      const lc = e.keyCode || e.which;
      return { 37: 'left', 38: 'up', 39: 'right', 40: 'down' }[lc] || null;
    }

    /** 回车 / OK 键识别（13=Enter，23=Android DPAD_CENTER） */
    function isActivationKey(e, allowSpace) {
      const k = e.key;
      if (k === 'Enter' || k === 'OK' || k === 'Select' || k === 'Accept') return true;
      if (allowSpace && k === ' ') return true;
      const lc = e.keyCode || e.which;
      return lc === 13 || lc === 23;
    }

    /** 返回/退出键识别（27=Esc，461/10009=TV 返回键） */
    function isBackKey(e) {
      const k = e.key;
      if (k === 'Escape' || k === 'Esc' || k === 'GoBack' || k === 'BrowserBack' || k === 'Back') return true;
      const lc = e.keyCode || e.which;
      return lc === 27 || lc === 8 || lc === 461 || lc === 10009;
    }

    function isEditable(el) {
      if (!el || el.nodeType !== 1) return false;
      const tag = el.tagName;
      if (tag === 'TEXTAREA') return !el.readOnly && !el.disabled;
      if (tag === 'INPUT') {
        const t = String(el.type || 'text').toLowerCase();
        return (
          !el.readOnly &&
          !el.disabled &&
          ['text', 'search', 'url', 'tel', 'email', 'password', 'number', 'date', 'datetime-local', 'month', 'time', 'week'].indexOf(t) >= 0
        );
      }
      return !!el.isContentEditable;
    }

    /** 可见 + 可用 */
    function isCandidateVisible(el) {
      if (el.hidden) return false;
      if (el.hasAttribute('disabled')) return false;
      if (el.getAttribute('aria-hidden') === 'true') return false;
      if (el.getAttribute('aria-disabled') === 'true') return false;
      if (el.closest && el.closest('[inert]')) return false;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.visibility === 'collapse') return false;
      if (Number(cs.opacity) === 0) return false;
      const r = el.getBoundingClientRect();
      // 只过滤"物理上点不到"的元素；屏幕外元素保留，用于触发滚动跟随
      return r.width > 1 && r.height > 1;
    }

    function rectOf(el) {
      const r = el.getBoundingClientRect();
      return {
        el,
        left: r.left,
        top: r.top,
        right: r.right,
        bottom: r.bottom,
        cx: (r.left + r.right) / 2,
        cy: (r.top + r.bottom) / 2,
        w: r.width,
        h: r.height,
      };
    }

    /** 一维区间重叠长度 */
    function overlap(a1, a2, b1, b2) {
      return Math.min(a2, b2) - Math.max(a1, b1);
    }

    /** 一维区间间隙（有重叠则为 0） */
    function gapOf(a1, a2, b1, b2) {
      const ov = overlap(a1, a2, b1, b2);
      if (ov > 0) return 0;
      return Math.min(Math.abs(b1 - a2), Math.abs(a1 - b2));
    }

    /** 找最近的可滚动祖先 */
    function scrollableAncestor(el) {
      let n = el.parentElement;
      while (n && n !== document.body && n !== document.documentElement) {
        const cs = getComputedStyle(n);
        const scrollable = /(auto|scroll|overlay)/.test(cs.overflowY + cs.overflowX);
        if (scrollable && (n.scrollHeight > n.clientHeight + 1 || n.scrollWidth > n.clientWidth + 1)) return n;
        n = n.parentElement;
      }
      return null;
    }

    /* ------------------------------------------------------------------ */
    /* 空间寻路（纯函数，便于单测）                                         */
    /* ------------------------------------------------------------------ */

    /**
     * 在给定方向上挑选最佳候选。
     * 排序规则（与 DOM 顺序无关）：
     *   tier 0 — 副轴对齐（有重叠 或 错位 ≤ slack）
     *   tier 1 — 未对齐但仍在行进方向
     * 同 tier 内按 score = 主轴间隙 + weight * 副轴间隙 取最小。
     * @param {'up'|'down'|'left'|'right'} dir
     * @param {object} cur 当前焦点 rect
     * @param {object[]} cands 候选 rect 列表
     */
    function pickDirectional(dir, cur, cands, cfg = DEFAULTS) {
      const sign = dir === 'right' || dir === 'down' ? 1 : -1;
      const horizontal = dir === 'left' || dir === 'right';
      const curCenter = horizontal ? cur.cx : cur.cy;
      const weight = cfg.crossAxisWeight ?? DEFAULTS.crossAxisWeight;
      const slack = cfg.alignmentSlack ?? DEFAULTS.alignmentSlack;

      let best = null;
      for (let i = 0; i < cands.length; i++) {
        const c = cands[i];
        if (!c) continue;
        const center = horizontal ? c.cx : c.cy;
        // 必须在行进方向上（用中心点判定，避免大小元素互相包含时死锁）
        if ((center - curCenter) * sign <= EPS) continue;

        let majorGap;
        let crossGap;
        if (horizontal) {
          majorGap = sign > 0 ? c.left - cur.right : cur.left - c.right;
          crossGap = gapOf(cur.top, cur.bottom, c.top, c.bottom);
        } else {
          majorGap = sign > 0 ? c.top - cur.bottom : cur.top - c.bottom;
          crossGap = gapOf(cur.left, cur.right, c.left, c.right);
        }
        const tier = crossGap <= slack ? 0 : 1;
        const score = Math.max(majorGap, 0) + weight * crossGap;

        if (!best || tier < best.tier || (tier === best.tier && score < best.score)) {
          best = { rect: c, tier, score };
        }
      }
      return best ? best.rect : null;
    }

    /**
     * 边界循环：跳到行进方向反向的尽头，优先回到"同一行/同一列"。
     */
    function pickWrap(dir, cur, cands, cfg = DEFAULTS) {
      const sign = dir === 'right' || dir === 'down' ? 1 : -1;
      const horizontal = dir === 'left' || dir === 'right';
      const curCenter = horizontal ? cur.cx : cur.cy;
      const slack = cfg.wrapCrossSlack ?? DEFAULTS.wrapCrossSlack;

      let best = null;
      for (let i = 0; i < cands.length; i++) {
        const c = cands[i];
        if (!c) continue;
        const center = horizontal ? c.cx : c.cy;
        const delta = center - curCenter;
        if (delta * sign >= -EPS) continue; // 只考虑反方向的元素

        const crossGap = horizontal ? gapOf(cur.top, cur.bottom, c.top, c.bottom) : gapOf(cur.left, cur.right, c.left, c.right);
        const tier = crossGap <= slack ? 0 : 1;
        const crossKey = Math.round(crossGap / 8); // 量化，避免 1px 抖动决定结果
        const back = Math.abs(delta); // 越"靠前"的元素 back 越大
        // 优先级：同 tier → 离当前行/列越近 → 越靠行/列首
        const better =
          !best || tier < best.tier || (tier === best.tier && (crossKey < best.crossKey || (crossKey === best.crossKey && back > best.back)));
        if (better) {
          best = { rect: c, tier, crossKey, back };
        }
      }
      return best ? best.rect : null;
    }

    /**
     * 无焦点时的入口元素。
     * @param {'top-left'|'center'|'dom-first'} strategy
     */
    function pickEntry(cands, strategy, viewport) {
      if (!cands.length) return null;
      if (strategy === 'dom-first') return cands[0];
      if (strategy === 'center') {
        const vw = viewport ? viewport.width : window.innerWidth;
        const vh = viewport ? viewport.height : window.innerHeight;
        let best = cands[0];
        let bestD = Infinity;
        for (const c of cands) {
          const d = Math.abs(c.cx - vw / 2) + Math.abs(c.cy - vh / 2);
          if (d < bestD) {
            bestD = d;
            best = c;
          }
        }
        return best;
      }
      // top-left：按"行"聚类，行内从左到右，取第一行第一个
      const tol = 24;
      const rows = [];
      for (const c of cands) {
        let row = null;
        for (const r of rows) {
          if (Math.abs(r.cy - c.cy) <= tol) {
            row = r;
            break;
          }
        }
        if (row) row.items.push(c);
        else rows.push({ cy: c.cy, items: [c] });
      }
      rows.sort((a, b) => a.cy - b.cy);
      rows[0].items.sort((a, b) => a.left - b.left);
      return rows[0].items[0];
    }

    /**
     * 长按加速系数：按住越久滚得越快，到 ramp 后稳定在 max 倍。
     * @param {number} heldMs 已按住时长(ms)
     * @param {object} [cfg] 含 scrollAccelMax / scrollAccelRampMs
     * @returns {number} 1 ~ scrollAccelMax
     */
    function scrollForce(heldMs, cfg = DEFAULTS) {
      const max = Math.max(1, Number(cfg.scrollAccelMax ?? DEFAULTS.scrollAccelMax));
      const ramp = Math.max(1, Number(cfg.scrollAccelRampMs ?? DEFAULTS.scrollAccelRampMs));
      const ratio = Math.max(0, Math.min(1, Number(heldMs) / ramp));
      return 1 + ratio * (max - 1);
    }

    /* ------------------------------------------------------------------ */
    /* 主类                                                                */
    /* ------------------------------------------------------------------ */

    class RemoteNav {
      constructor(options = {}) {
        this.opts = Object.assign({}, DEFAULTS, options);
        this.enabled = false;
        this._items = []; // 候选元素
        this._dirty = true;
        this._current = null;
        this._currentRect = null;
        this._lastMoveAt = 0;
        this._handlers = new Map();
        this._rafId = 0; // 高亮刷新用的 rAF
        this._validateRafId = 0; // 焦点有效性校验用的 rAF（与上面分开，避免互相顶掉）
        this._overlay = null;
        this._mo = null;

        // 方向键长按状态：用于边界滚动加速
        this._hold = { dir: null, startedAt: 0, lastAt: 0 };
        // 阅读滚动模式：一旦在边界处滚动，接下来的上下键继续滚动会话，不急着挑远处候选
        this._scrolling = false;

        // 所有回调都绑定 this，保持引用以便 destroy 时精确移除
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onPointerDown = this._onPointerDown.bind(this);
        this._onScrollOrResize = this._onScrollOrResize.bind(this);
        this._onFocusIn = this._onFocusIn.bind(this);

        this._install();

        if (this.opts.autoEnable || this.opts.enabled) this.enable();
      }

      /* ---------------- 生命周期 ---------------- */

      _install() {
        // capture 阶段监听：抢在业务 handler 之前，且不依赖冒泡链
        window.addEventListener('keydown', this._onKeyDown, true);
        window.addEventListener('pointerdown', this._onPointerDown, true);
        window.addEventListener('scroll', this._onScrollOrResize, { capture: true, passive: true });
        window.addEventListener('resize', this._onScrollOrResize, { passive: true });
        document.addEventListener('focusin', this._onFocusIn, true);
        if (this.opts.overlay) this._ensureOverlay();
      }

      destroy() {
        window.removeEventListener('keydown', this._onKeyDown, true);
        window.removeEventListener('pointerdown', this._onPointerDown, true);
        window.removeEventListener('scroll', this._onScrollOrResize, true);
        window.removeEventListener('resize', this._onScrollOrResize);
        document.removeEventListener('focusin', this._onFocusIn, true);
        document.documentElement.classList.remove('remote-nav-on');
        this._disconnectObserver();
        if (this._rafId) cancelAnimationFrame(this._rafId);
        if (this._validateRafId) cancelAnimationFrame(this._validateRafId);
        this._rafId = 0;
        this._validateRafId = 0;
        if (this._overlay && this._overlay.parentNode) this._overlay.parentNode.removeChild(this._overlay);
        this._overlay = null;
        this._current = null;
        this._items = [];
        this._handlers.clear();
      }

      enable() {
        if (this.enabled) return;
        this.enabled = true;
        this._dirty = true;
        this._scrolling = false;
        document.documentElement.classList.add('remote-nav-on');
        if (this._overlay) this._overlay.hidden = true;
        this._observe();
        // 注意：不自动选焦点 —— 需求要求"首次按键"才选中第一个元素
        this._emit('enter');
      }

      disable() {
        if (!this.enabled) return;
        this.enabled = false;
        this._scrolling = false;
        this._clearMark();
        this._current = null;
        this._currentRect = null;
        if (this._overlay) this._overlay.hidden = true;
        document.documentElement.classList.remove('remote-nav-on');
        this._disconnectObserver();
        this._emit('leave');
      }

      toggle() {
        this.enabled ? this.disable() : this.enable();
      }

      /* ---------------- 事件 ---------------- */

      on(type, fn) {
        if (!this._handlers.has(type)) this._handlers.set(type, new Set());
        this._handlers.get(type).add(fn);
        return this;
      }

      off(type, fn) {
        const set = this._handlers.get(type);
        if (set) set.delete(fn);
        return this;
      }

      _emit(type, payload) {
        const set = this._handlers.get(type);
        if (!set) return;
        for (const fn of set) {
          try {
            fn(payload);
          } catch (err) {
            console.error('[remote-nav] handler error:', err);
          }
        }
      }

      get current() {
        return this._current;
      }

      /* ---------------- 候选集合 ---------------- */

      refresh() {
        this._dirty = true;
        return this;
      }

      _collect() {
        const root = this.opts.root || document.body;
        const out = [];
        if (!root) {
          this._items = out;
          this._dirty = false;
          return;
        }
        const nodes = root.querySelectorAll(this.opts.selector);
        for (let i = 0; i < nodes.length; i++) {
          const el = nodes[i];
          if (el === this._overlay || el.classList.contains(this.opts.highlightClassName)) continue;
          if (this.opts.ignoreSelector && el.closest(this.opts.ignoreSelector)) continue;
          // 只跳过该元素自身（不连带子元素）：聊天里的展开行等“记录型”可点区域
          if (this.opts.skipSelector && el.matches(this.opts.skipSelector)) continue;
          // 输入卡片已作为整体候选；卡片里的文字输入区（contenteditable）不再单独占一个框
          if (
            this.opts.composerInputSelector &&
            el.matches(this.opts.composerInputSelector) &&
            el.closest(this.opts.composerCardSelector)
          ) {
            continue;
          }
          if (!isCandidateVisible(el)) continue;
          out.push(el);
        }
        this._items = out;
        this._dirty = false;
      }

      _rects(exclude, dir) {
        const list = [];
        const items = this._items;
        for (let i = 0; i < items.length; i++) {
          const el = items[i];
          if (el === exclude) continue;
          if (!el.isConnected) continue;
          // 左右移动时不跳进“包住当前元素的大框”（例如包住底部按钮的输入卡片），
          // 否则大框中心在右侧时会把同一行相邻按钮全遮住；上下方向仍允许回到外层卡片。
          if (exclude && (dir === 'left' || dir === 'right') && el.contains(exclude)) continue;
          list.push(rectOf(el));
        }
        return list;
      }

      _observe() {
        if (this._mo || typeof MutationObserver === 'undefined') return;
        this._mo = new MutationObserver((records) => {
          let dirty = false;
          for (const r of records) {
            const t = r.target;
            if (this._overlay && (t === this._overlay || (t.nodeType === 1 && t.classList && t.classList.contains(this.opts.highlightClassName)))) {
              continue; // 忽略自身 overlay 的样式变更，避免自激循环
            }
            dirty = true;
            break;
          }
          if (dirty) {
            this._dirty = true;
            this._scheduleValidate();
          }
        });
        this._mo.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['style', 'class', 'hidden', 'disabled', 'aria-hidden', 'aria-disabled', 'tabindex'],
        });
      }

      _disconnectObserver() {
        if (this._mo) {
          this._mo.disconnect();
          this._mo = null;
        }
      }

      /** 元素被框架重渲染掉时，把焦点迁移到"原位置最近"的元素 */
      _scheduleValidate() {
        if (this._validateRafId) return;
        this._validateRafId = requestAnimationFrame(() => {
          this._validateRafId = 0;
          if (!this.enabled) return;
          const cur = this._current;
          if (cur && cur.isConnected && isCandidateVisible(cur)) {
            this._currentRect = rectOf(cur);
            this._updateOverlay();
            return;
          }
          if (!this._currentRect) {
            this._clearMark();
            this._current = null;
            if (this._overlay) this._overlay.hidden = true;
            return;
          }
          // 用最后的矩形位置找回最近的可交互元素（视觉上不跳跃）
          if (this._dirty) this._collect();
          let best = null;
          let bestD = Infinity;
          for (let i = 0; i < this._items.length; i++) {
            const el = this._items[i];
            if (!el.isConnected) continue;
            const r = rectOf(el);
            const d = Math.abs(r.cx - this._currentRect.cx) + Math.abs(r.cy - this._currentRect.cy);
            if (d < bestD) {
              bestD = d;
              best = el;
            }
          }
          if (best) this._focus(best, 'relocate');
          else {
            this._current = null;
            if (this._overlay) this._overlay.hidden = true;
          }
        });
      }

      /* ---------------- 移动 ---------------- */

      /**
       * 朝某方向移动焦点。
       * @returns {boolean} 是否发生了移动
       */
      move(dir) {
        if (!this.enabled) return false;
        if (this._dirty) this._collect();

        // 阅读滚动模式：上下键继续滚动会话（长按加速）；滚到头或换方向再回到候选导航
        if (this._scrolling && (dir === 'up' || dir === 'down') && this._scrollByDirection(dir)) {
          this._emit('scroll', { direction: dir, element: this._current });
          return true;
        }

        // 当前焦点失效（被移除/隐藏）时，退化到入口逻辑
        let curEl = this._current;
        if (curEl && (!curEl.isConnected || !isCandidateVisible(curEl))) curEl = null;

        const cands = this._rects(curEl || null, dir);

        if (!curEl) {
          const entry = pickEntry(cands, this.opts.entry, { width: window.innerWidth, height: window.innerHeight });
          if (!entry) return false;
          this._focus(entry.el, 'entry');
          return true;
        }

        const curRect = rectOf(curEl);
        const best = pickDirectional(dir, curRect, cands, this.opts);
        if (best) {
          // 阅读会话时，上下键优先滚动正文；只有滚到头了才把光标交给输入框
          if (this._preferScrollOverJump(dir, best.el)) {
            this._emit('scroll', { direction: dir, element: curEl });
            return true;
          }
          this._focus(best.el, dir);
          return true;
        }

        if (this.opts.wrap) {
          const wrapped = pickWrap(dir, curRect, cands, this.opts);
          if (wrapped) {
            this._focus(wrapped.el, 'wrap');
            this._emit('wrap', { direction: dir, element: wrapped.el });
            return true;
          }
        }

        // 该方向没有候选：上下键滚动最近的会话滚动区（长按加速），滚到头才回弹
        if (this.opts.scrollOnBoundary && this._scrollByDirection(dir)) {
          this._emit('scroll', { direction: dir, element: curEl });
          return true;
        }

        // 边界：停住 + 视觉回弹反馈
        this._bounce();
        this._emit('boundary', { direction: dir, element: curEl });
        return false;
      }

      /** 设置焦点到指定元素 */
      setCurrent(el) {
        if (!el) return false;
        this._focus(el, 'api');
        return true;
      }

      _focus(el, reason) {
        this._clearMark();
        this._scrolling = false;
        this._current = el;
        this._currentRect = rectOf(el);
        if (this.opts.markElement) el.setAttribute('data-remote-nav-current', '');

        this._ensureVisible(el);
        this._updateOverlay();
        this._emit('focus', { element: el, reason, rect: this._currentRect });
      }

      _clearMark() {
        if (!this.opts.markElement) return;
        const prev = document.querySelector('[data-remote-nav-current]');
        if (prev) prev.removeAttribute('data-remote-nav-current');
      }

      /* ---------------- 激活 ---------------- */

      activate() {
        const el = this._current;
        if (!el || !el.isConnected) return false;
        this._emit('activate', { element: el });
        // 输入卡片：整张卡片作为一个目标，激活直接进入卡片里的文字输入区
        if (this.opts.composerCardSelector && el.matches(this.opts.composerCardSelector)) {
          const input = el.querySelector(this.opts.composerInputSelector) || null;
          if (input !== null) {
            try {
              input.focus({ preventScroll: true });
            } catch (_) {
              input.focus();
            }
            return true;
          }
        }
        const mode = this.opts.activation;
        if (isEditable(el) || mode === 'focus') {
          try {
            el.focus({ preventScroll: true });
          } catch (_) {
            el.focus();
          }
          return true;
        }
        if (typeof el.click === 'function') {
          el.click();
          this._dirty = true; // 激活后可能要换视图，下一次按键前重新收集候选
          return true;
        }
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        this._dirty = true;
        return true;
      }

      /* ---------------- 滚动跟随 ---------------- */

      _ensureVisible(el) {
        if (!this.opts.scrollFollow) return;
        const m = this.opts.scrollMargin;
        let box = this.opts.scrollContainer;
        if (typeof box === 'function') box = box(el);
        if (box === null || box === undefined) box = scrollableAncestor(el);
        if (box instanceof Window) box = null;

        const view = box
          ? box.getBoundingClientRect()
          : { top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight };

        const r = el.getBoundingClientRect();
        let dy = 0;
        let dx = 0;
        if (r.top < view.top + m) dy = r.top - view.top - m;
        else if (r.bottom > view.bottom - m) dy = r.bottom - view.bottom + m;
        if (r.left < view.left + m) dx = r.left - view.left - m;
        else if (r.right > view.right - m) dx = r.right - view.right + m;

        if (!dx && !dy) return;
        const behavior = this.opts.scrollBehavior;
        if (box) box.scrollBy({ left: dx, top: dy, behavior });
        else window.scrollBy({ left: dx, top: dy, behavior });
        this._emit('scroll', { element: el, dx, dy });
      }

      /* ---------------- 高亮 overlay ---------------- */

      _ensureOverlay() {
        if (this._overlay) return this._overlay;
        const ov = document.createElement('div');
        ov.className = this.opts.highlightClassName;
        ov.setAttribute('data-remote-nav-ignore', '');
        ov.setAttribute('aria-hidden', 'true');
        ov.hidden = true;
        document.body.appendChild(ov);
        this._overlay = ov;
        return ov;
      }

      _updateOverlay() {
        if (!this.opts.overlay) return;
        const ov = this._ensureOverlay();
        const el = this._current;
        if (!el || !el.isConnected) {
          ov.hidden = true;
          return;
        }
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) {
          ov.hidden = true;
          return;
        }
        const p = this.opts.highlightPadding;
        ov.style.width = `${Math.round(r.width + p * 2)}px`;
        ov.style.height = `${Math.round(r.height + p * 2)}px`;
        ov.style.transform = `translate3d(${Math.round(r.left - p)}px, ${Math.round(r.top - p)}px, 0)`;
        ov.hidden = false;
      }

      _bounce() {
        const ov = this._overlay;
        if (!ov || ov.hidden) return;
        ov.classList.remove('is-bounce');
        // 强制回流以重启动画
        void ov.offsetWidth;
        ov.classList.add('is-bounce');
      }

      /* ---------------- 原生事件 ---------------- */

      _onScrollOrResize() {
        if (!this.enabled) return;
        if (this._rafId) return;
        this._rafId = requestAnimationFrame(() => {
          this._rafId = 0;
          if (this.enabled) this._updateOverlay();
        });
      }

      _onPointerDown(e) {
        // 模式关闭时完全不介入
        if (!this.enabled || !this.opts.syncOnPointer) return;
        const target = e.target;
        if (!target || this._overlay === target) return;
        // 点击到的元素若在候选内，直接同步；否则同步到最近候选
        if (this._dirty) this._collect();
        let hit = null;
        // 输入卡片内部的点击（文字输入区等）统一同步到整张卡片
        const card = target.closest ? target.closest(this.opts.composerCardSelector) : null;
        if (card !== null && this._items.indexOf(card) >= 0) hit = card;
        if (!hit) {
          for (let i = 0; i < this._items.length; i++) {
            const el = this._items[i];
            if (el === target || el.contains(target)) {
              hit = el;
              break;
            }
          }
        }
        if (!hit) {
          let bestD = Infinity;
          for (let i = 0; i < this._items.length; i++) {
            const el = this._items[i];
            if (!el.contains(target)) continue;
            const r = rectOf(el);
            const d = r.w * r.h;
            if (d < bestD) {
              bestD = d;
              hit = el;
            }
          }
        }
        if (hit) this._focus(hit, 'pointer');
      }

      _onFocusIn(e) {
        // Tab / 业务代码主动聚焦时保持同步，但输入框聚焦不抢（输入框只映射到它所在的输入卡片）
        if (!this.enabled || !this.opts.syncOnPointer) return;
        const el = e.target;
        if (!el || el === this._overlay) return;
        const isComposerInput = !!(this.opts.composerInputSelector && el.matches && el.matches(this.opts.composerInputSelector));
        if (isEditable(el) && !isComposerInput) return;
        const mapped = isComposerInput ? el.closest(this.opts.composerCardSelector) : el;
        if (!mapped || this._current === mapped) return;
        if (this._dirty) this._collect();
        if (this._items.indexOf(mapped) >= 0) this._focus(mapped, 'native-focus');
      }

      _onKeyDown(e) {
        if (!this.enabled) return; // ← 模式关闭：零拦截
        if (e.__remoteNavSynthetic) return; // 返回键自己合成的 Escape，不能再被自己拦一次
        if (this._overlay && e.target === this._overlay) return;
        if (e.defaultPrevented) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return; // 组合键交还系统

        // 模式切换键
        if (this.opts.toggleKey && (e.key === this.opts.toggleKey || e.code === this.opts.toggleKey)) {
          this.disable();
          e.preventDefault();
          return;
        }

        const editable = isEditable(document.activeElement);
        const editing = editable && this.opts.pauseWhileEditing;

        const dir = directionOf(e);
        if (dir) {
          if (editing && this.opts.leaveEditingOnArrow !== false) {
            // 遥控器模式：进入会话后输入框会被自动聚焦，方向键第一次先把焦点交还给导航，
            // 否则虚拟光标看起来就“卡住”了（键盘用户可把 leaveEditingOnArrow 设为 false）。
            this._leaveEditingForNav();
            e.preventDefault();
            if (this.opts.stopPropagation) e.stopPropagation();
            return;
          }
          if (editing) return; // 输入框内：方向键移动文本光标
          const now = Date.now();
          if (now - this._lastMoveAt < this.opts.repeatGuardMs) {
            e.preventDefault();
            if (this.opts.stopPropagation) e.stopPropagation();
            return;
          }
          this._lastMoveAt = now;
          this.move(dir);
          e.preventDefault(); // 阻止页面原生滚动
          if (this.opts.stopPropagation) e.stopPropagation();
          return;
        }

        if (isActivationKey(e, !!this.opts.activateOnSpace)) {
          if (editing) return; // 输入框内回车照常发送
          if (!this._current) {
            // 无焦点时按 OK：先选中入口元素（符合"首次按键选中第一个"）
            this.move('down');
            e.preventDefault();
            if (this.opts.stopPropagation) e.stopPropagation();
            return;
          }
          this.activate();
          e.preventDefault();
          if (this.opts.stopPropagation) e.stopPropagation();
          return;
        }

        if (isBackKey(e) && this.opts.escape === 'exit') {
          // 输入框里的退格（keyCode 8）必须留给原生删字；其余返回键走分层逻辑
          const lc = e.keyCode || e.which;
          const key = String(e.key || '');
          const realBack =
            key === 'Escape' ||
            key === 'Esc' ||
            key === 'GoBack' ||
            key === 'BrowserBack' ||
            key === 'Back' ||
            lc === 27 ||
            lc === 461 ||
            lc === 10009;
          if (editing && !realBack) return;
          const action = this._backAction();
          if (action === 'exit') {
            this.disable();
            if (this.opts.escapeConsume) {
              e.preventDefault();
              e.stopPropagation();
            }
            return;
          }
          e.preventDefault();
          if (this.opts.stopPropagation) e.stopPropagation();
          return;
        }
      }

      /* ---------------- 返回键分层 ---------------- */

      /**
       * 遥控器模式下退出文字输入：blur 当前输入框，并把虚拟光标放回它所在的输入卡片。
       * 主要用于“进入会话后输入框自动聚焦、方向键看起来卡住”的场景。
       */
      _leaveEditingForNav() {
        const active = document.activeElement;
        const card = active && active.closest ? active.closest(this.opts.composerCardSelector) : null;
        try {
          if (active && typeof active.blur === 'function') active.blur();
        } catch (_) {
          /* 某些输入框不可 blur，忽略 */
        }
        this._dirty = true;
        if (card !== null) this._focus(card, 'leave-editing');
      }

      /**
       * 返回键的优先级：先退出文字输入 → 再关闭打开的弹层 → 最后才退出导航模式。
       * @returns {'blur'|'overlay'|'exit'}
       */
      _backAction() {
        const active = document.activeElement;
        if (isEditable(active)) {
          const card = active.closest ? active.closest(this.opts.composerCardSelector) : null;
          try {
            active.blur();
          } catch (_) {
            /* 某些输入框不可 blur，忽略 */
          }
          if (card !== null) this._focus(card, 'back-blur');
          return 'blur';
        }
        const overlay = this._openOverlay();
        if (overlay !== null) {
          this._dispatchEscape(overlay);
          return 'overlay';
        }
        return 'exit';
      }

      /** 当前是否有一个可见的弹层（菜单 / 对话框 / 下拉列表） */
      _openOverlay() {
        const sel = this.opts.overlaySelector;
        if (!sel) return null;
        let nodes;
        try {
          nodes = document.querySelectorAll(sel);
        } catch (_) {
          return null;
        }
        for (let i = 0; i < nodes.length; i++) {
          const el = nodes[i];
          if (!isCandidateVisible(el)) continue;
          return el;
        }
        return null;
      }

      /** 把一次 Escape 交还给页面自己的弹层处理（带标记，避免被本引擎再次拦截） */
      _dispatchEscape(overlay) {
        const active = document.activeElement;
        let target = document;
        if (overlay && typeof overlay.dispatchEvent === 'function') target = overlay;
        if (
          active &&
          active !== document.body &&
          overlay &&
          typeof overlay.contains === 'function' &&
          overlay.contains(active)
        ) {
          target = active;
        }
        const ev = new KeyboardEvent('keydown', {
          key: 'Escape',
          code: 'Escape',
          keyCode: 27,
          which: 27,
          bubbles: true,
          cancelable: true,
        });
        ev.__remoteNavSynthetic = true;
        target.dispatchEvent(ev);
      }

      /**
       * 阅读会话时，上下方向的下一个候选是“输入框”而不是正文内容：
       * 先滚动正文，滚到头再跳进输入框。这样长按上下键就能顺畅地读长消息。
       * @returns {boolean} 是否已经用滚动代替了这次跳转
       */
      _preferScrollOverJump(dir, nextEl) {
        if (dir !== 'up' && dir !== 'down') return false;
        if (this.opts.scrollOnBoundary === false) return false;
        const cardSel = this.opts.composerCardSelector;
        const cur = this._current;
        if (!cardSel || !cur || typeof cur.closest !== 'function') return false;
        if (cur.closest(cardSel)) return false; // 光标已经在输入框里：不抢方向键
        if (!nextEl || typeof nextEl.closest !== 'function' || nextEl.closest(cardSel) === null) return false;
        return this._scrollByDirection(dir);
      }

      /* ---------------- 边界滚动（长按加速） ---------------- */

      /** 该方向没有候选时，要滚动的容器：优先当前元素最近的滚动祖先，其次会话滚动区 */
      _scrollTarget() {
        if (this._current) {
          let box = this.opts.scrollContainer;
          if (typeof box === 'function') box = box(this._current);
          if (box === null || box === undefined) box = scrollableAncestor(this._current);
          if (box instanceof Window) return null;
          return box && typeof box.scrollBy === 'function' ? box : null;
        }
        const conv = document.querySelector(this.opts.conversationScrollSelector);
        return conv && typeof conv.scrollBy === 'function' ? conv : null;
      }

      /**
       * 上下键在边界处滚动会话；连续按同一方向时按按住时长加速。
       * @returns {boolean} 是否真的滚动了
       */
      _scrollByDirection(dir) {
        if (dir !== 'up' && dir !== 'down') return false;
        const target = this._scrollTarget();
        if (!target) return false;
        const now = Date.now();
        const hold = this._hold;
        if (hold.dir !== dir || now - hold.lastAt > this.opts.scrollHoldGapMs) {
          hold.dir = dir;
          hold.startedAt = now;
        }
        hold.lastAt = now;
        const factor = this.opts.scrollAccelerate ? scrollForce(now - hold.startedAt, this.opts) : 1;
        const step = Math.max(1, Math.round(this.opts.scrollStep * factor));
        const before = target.scrollTop;
        target.scrollBy({ top: dir === 'down' ? step : -step, behavior: 'auto' });
        const moved = target.scrollTop !== before;
        if (moved) this._scrolling = true;
        return moved;
      }
    }

    /* ------------------------------------------------------------------ */
    /* 工厂                                                                */
    /* ------------------------------------------------------------------ */

    function createRemoteNav(options = {}) {
      return new RemoteNav(options);
    }



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

    const STORAGE_KEY = 'dsh:remoteNav:config';
    const STYLE_ATTR = 'data-dsh-remote-nav';

    const UI_DEFAULTS = {
      wrap: false, // 边界停住 / 循环
      entry: 'top-left',
      scrollFollow: true,
      highlightPadding: 5,
      pauseWhileEditing: true,
      leaveEditingOnArrow: true, // 输入框里按方向键先退出输入，避免光标看起来卡住
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
    function boot(overrides = {}) {
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



    /**
     * dsh-client.js — DSH Web UI 客户端插件入口
     *
     * 构建脚本把 remote-nav.js（引擎）、dsh-autostart.js（挂载 / HUD / 诊断）和本文件
     * 拼进一个 ModuleLoader 工厂，调用 createClientPlugin(React) 得到 Cordis 客户端插件：
     *
     *   - apply()  挂载导航引擎（全局键盘监听 + 高亮层 + HUD），并在侧边栏脚部注册开关按钮；
     *   - dispose  由 ctx.effect 注册的清理函数完成，移除全部监听器 / DOM / 样式并删除全局别名；
     *   - locale   文案经宿主 locale 服务提供（zh / en），切换语言即时生效。
     *
     * 引擎本身零依赖：只要客户端插件被加载，方向键 / 遥控器导航即可工作，
     * 不依赖 DSH 内部渲染结构，也不改动业务 DOM。
     */

    /**
     * @param {object} React 宿主注入的 React 运行时。
     * @returns {object} Cordis 客户端插件（inject + apply）。
     */
    function createClientPlugin(React) {
      const h = React.createElement;

      const NS = 'remote-nav';
      const DICT = {
        zh: {
          title: '遥控器导航',
          description: '开 / 关遥控器方向键导航',
          on: '遥控器导航已开启',
          off: '遥控器导航已关闭',
        },
        en: {
          title: 'Remote navigation',
          description: 'Turn remote / D-pad navigation on or off',
          on: 'Remote navigation on',
          off: 'Remote navigation off',
        },
      };
      const fallbackLang = () =>
        String(globalThis.document?.documentElement?.lang ?? '').toLowerCase().startsWith('zh') ? 'zh' : 'en';
      const fallbackT = (key) => DICT[fallbackLang()][key] ?? DICT.zh[key] ?? key;

      const LocaleContext = React.createContext(null);
      const useT = () => React.useContext(LocaleContext) ?? fallbackT;

      /** 把宿主通过注册项 `locale` 注入的 t 放进 context；老宿主没有 t 时退回 fallbackT。 */
      function withLocale(Component) {
        return function LocaleRoot(props) {
          const t = props.t ?? fallbackT;
          return h(LocaleContext.Provider, { value: t }, h(Component, props));
        };
      }

      /* ------------------------------------------------------------------ */
      /* 引擎实例与开关按钮共享的状态                                         */
      /* ------------------------------------------------------------------ */

      let active = null; // 当前 dshNav API（boot() 的返回值）
      const watchers = new Set();

      const snapshot = () => ({
        mounted: !!active,
        enabled: !!active && !!active.nav.enabled,
        wrap: !!active && !!active.config.wrap,
      });

      function emit() {
        const state = snapshot();
        for (const watcher of watchers) {
          try {
            watcher(state);
          } catch (err) {
            console.error('[remote-nav] watcher 失败', err);
          }
        }
      }

      function attach(instance) {
        active = instance;
        if (instance) {
          instance.nav.on('enter', emit);
          instance.nav.on('leave', emit);
        }
        emit();
      }

      function detach() {
        active = null;
        emit();
      }

      /* ------------------------------------------------------------------ */
      /* 侧边栏脚部的开关按钮                                                 */
      /* ------------------------------------------------------------------ */

      function DpadIcon() {
        return h(
          'svg',
          {
            viewBox: '0 0 24 24',
            width: 18,
            height: 18,
            'aria-hidden': true,
            style: { display: 'block' },
          },
          h('circle', { cx: 12, cy: 12, r: 5.2, fill: 'none', stroke: 'currentColor', strokeWidth: 2 }),
          h('path', {
            d: 'M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2,
            strokeLinecap: 'round',
          })
        );
      }

      function RemoteNavButton(props) {
        const t = useT();
        const [state, setState] = React.useState(snapshot);

        React.useEffect(() => {
          watchers.add(setState);
          setState(snapshot());
          return () => {
            watchers.delete(setState);
          };
        }, []);

        const hint = state.enabled ? t('on') : t('off');
        return h(
          'button',
          {
            type: 'button',
            className: 'dsh-remote-nav-btn' + (state.enabled ? ' is-on' : ''),
            'aria-label': t('title'),
            'aria-pressed': state.enabled ? 'true' : 'false',
            title: `${t('title')} — ${state.enabled ? t('on') : t('off')}`,
            'data-remote-nav': '',
            onClick: () => {
              if (active) active.toggle();
            },
          },
          h(DpadIcon),
          h('span', { className: 'dsh-remote-nav-btn-tip', 'aria-hidden': true }, hint)
        );
      }

      /* ------------------------------------------------------------------ */
      /* 插件                                                                */
      /* ------------------------------------------------------------------ */

      let appliedCtx = null;

      return {
        inject: ['slots'],
        apply(ctx) {
          if (ctx === appliedCtx) return;
          appliedCtx = ctx;

          const previous = globalThis.window?.__dshRemoteNav;
          if (previous && typeof previous.destroy === 'function') previous.destroy();

          let instance = null;
          ctx.effect(() => {
            // css / 引擎源码由构建脚本注入到本工厂作用域
            instance = boot({ css: __CSS__ });
            attach(instance);
            return () => {
              detach();
              if (instance && typeof instance.destroy === 'function') instance.destroy();
              instance = null;
            };
          }, 'remote-nav: engine');

          const locale = ctx.get('locale');
          if (locale !== undefined) {
            ctx.effect(() => locale.register(NS, { zh: DICT.zh, en: DICT.en }), 'remote-nav: dictionaries');
          }
          const loc = locale === undefined ? {} : { locale: NS };
          const label = () => (locale === undefined ? fallbackT('title') : locale.bind(NS)('title'));

          ctx.slots.inject('sidebar.footer.action', () =>
            ctx.slots.register(
              {
                name: 'sidebar.footer.action',
                id: 'remote-nav',
                order: 30,
                label,
                ...loc,
              },
              withLocale(RemoteNavButton)
            )
          );
        },
      };
    }


    return createClientPlugin(React);
  },
});
