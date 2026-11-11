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
export function createClientPlugin(React) {
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
