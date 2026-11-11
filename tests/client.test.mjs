// client.js 的结构 / 生命周期测试：
// 1) ModuleLoader 工厂 id 必须等于包名（宿主按包名懒加载客户端模块）
// 2) apply() 挂载引擎并注册侧边栏开关；ctx.effect 的清理函数执行后全部副作用消失
// 3) 有 locale 服务时注册 zh/en 字典，并把 locale 交给 slot 注册项
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const ROOT = new URL('../', import.meta.url);
const pkg = JSON.parse(readFileSync(new URL('package.json', ROOT), 'utf8'));
const src = readFileSync(new URL('client.js', ROOT), 'utf8');

const makeEl = (tag = 'div') => {
  const el = {
    tagName: tag.toUpperCase(),
    nodeType: 1,
    style: {},
    hidden: true,
    isConnected: true,
    textContent: '',
    className: '',
    isContentEditable: false,
    attrs: {},
    children: [],
    parentNode: null,
    setAttribute(k, v) {
      this.attrs[k] = v;
    },
    getAttribute(k) {
      return this.attrs[k] ?? null;
    },
    removeAttribute(k) {
      delete this.attrs[k];
    },
    hasAttribute(k) {
      return k in this.attrs;
    },
    appendChild(c) {
      c.parentNode = this;
      this.children.push(c);
      return c;
    },
    removeChild(c) {
      const i = this.children.indexOf(c);
      if (i >= 0) this.children.splice(i, 1);
      c.parentNode = null;
      return c;
    },
    insertBefore(c) {
      return c;
    },
    addEventListener() {},
    removeEventListener() {},
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    closest() {
      return null;
    },
    contains() {
      return false;
    },
    getBoundingClientRect() {
      return { left: 0, top: 0, right: 100, bottom: 40, width: 100, height: 40 };
    },
    classList: { add() {}, remove() {}, contains: () => false, toggle() {} },
  };
  Object.defineProperty(el, 'innerHTML', { get: () => el._html ?? '', set: (v) => (el._html = v) });
  return el;
};

/** 造一个足以跑通引擎挂载 / 清理的最小浏览器环境 */
function createSandbox() {
  const head = makeEl('head');
  const body = makeEl('body');
  const html = makeEl('html');
  const document = {
    readyState: 'complete',
    head,
    body,
    documentElement: html,
    activeElement: null,
    createElement: (tag) => makeEl(tag),
    addEventListener() {},
    removeEventListener() {},
    querySelector: () => null,
    querySelectorAll: () => [],
  };
  const store = new Map();
  const sandbox = {
    console: { log() {}, info() {}, warn() {}, error() {} },
    document,
    location: { search: '', href: 'http://127.0.0.1:32070/' },
    localStorage: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
    },
    navigator: { languages: ['zh-CN'], language: 'zh-CN' },
    getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1', overflowY: 'auto', overflowX: 'auto' }),
    requestAnimationFrame: () => 1,
    cancelAnimationFrame: () => {},
    MutationObserver: class {
      observe() {}
      disconnect() {}
    },
    KeyboardEvent: class {},
    MouseEvent: class {},
    innerWidth: 1280,
    innerHeight: 720,
    setTimeout,
    clearTimeout,
    addEventListener() {},
    removeEventListener() {},
  };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.globalThis = sandbox;

  let captured = null;
  sandbox.__ModuleLoader__ = {
    load(spec) {
      captured = spec;
    },
  };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: 'client.js' });
  return { sandbox, head, body, html, getCaptured: () => captured };
}

const FakeReact = {
  createElement: (type, props, ...children) => ({ type, props, children }),
  createContext: () => ({ Provider: 'Provider' }),
  useContext: () => null,
  useState: (init) => [typeof init === 'function' ? init() : init, () => {}],
  useEffect: () => {},
};

function fakeCtx({ locale } = {}) {
  const cleanups = [];
  const registrations = [];
  const injections = [];
  const ctx = {
    get(name) {
      return name === 'locale' ? locale : undefined;
    },
    effect(callback, label) {
      const cleanup = callback();
      cleanups.push({ cleanup, label });
      return () => {};
    },
    slots: {
      inject(name, callback) {
        injections.push(name);
        callback();
        return () => {};
      },
      register(options, component) {
        registrations.push({ options, component });
        return () => {};
      },
    },
  };
  return { ctx, cleanups, registrations, injections };
}

test('工厂 id 等于包名，模块导出 inject/apply', () => {
  const { getCaptured } = createSandbox();
  const spec = getCaptured();
  assert.ok(spec, '应调用 window.__ModuleLoader__.load');
  assert.equal(spec.id, pkg.name);
  const plugin = spec.factory((name) => {
    if (name === 'react') return FakeReact;
    throw new Error('未声明的运行时依赖: ' + name);
  });
  assert.deepEqual(Array.from(plugin.inject), ['slots']);
  assert.equal(typeof plugin.apply, 'function');
});

test('apply 挂载引擎与开关按钮，清理函数可完全回滚', () => {
  const { sandbox, head, body, getCaptured } = createSandbox();
  const plugin = getCaptured().factory(() => FakeReact);
  const { ctx, cleanups, registrations, injections } = fakeCtx();

  plugin.apply(ctx);

  // 引擎已挂载：全局别名 + HUD + 样式
  assert.ok(sandbox.dshNav, 'window.dshNav 应存在');
  assert.ok(sandbox.__dshRemoteNav, 'window.__dshRemoteNav 应存在');
  assert.ok(
    body.children.some((el) => el.className === 'dsh-remote-nav-hud'),
    'HUD 应在 body 中'
  );
  assert.ok(
    head.children.some((el) => el.attrs && el.attrs['data-dsh-remote-nav'] === ''),
    '样式表应在 head 中'
  );

  // slot 注册
  assert.deepEqual(injections, ['sidebar.footer.action']);
  assert.equal(registrations.length, 1);
  const { options } = registrations[0];
  assert.equal(options.name, 'sidebar.footer.action');
  assert.equal(options.id, 'remote-nav');
  assert.equal(typeof options.label, 'function');
  assert.equal(options.locale, undefined, '无 locale 服务时不应传 locale');

  // 清理顺序：先 detach 再 destroy
  for (const { cleanup } of cleanups.reverse()) {
    if (typeof cleanup === 'function') cleanup();
  }
  assert.equal(sandbox.dshNav, undefined);
  assert.equal(sandbox.__dshRemoteNav, undefined);
  assert.ok(!body.children.some((el) => el.className === 'dsh-remote-nav-hud'), 'HUD 应被移除');
  assert.ok(!head.children.some((el) => el.attrs && el.attrs['data-dsh-remote-nav'] === ''), '样式应被移除');
});

test('有 locale 服务时注册中英字典并给组件注入 t', () => {
  const { getCaptured } = createSandbox();
  const plugin = getCaptured().factory(() => FakeReact);
  const registered = [];
  const locale = {
    register(ns, dicts) {
      registered.push({ ns, dicts });
      return () => {};
    },
    bind(ns) {
      return (key) => `${ns}.${key}`;
    },
  };
  const { ctx, registrations } = fakeCtx({ locale });

  plugin.apply(ctx);

  assert.equal(registered.length, 1);
  assert.equal(registered[0].ns, 'remote-nav');
  assert.equal(typeof registered[0].dicts.zh.title, 'string');
  assert.equal(typeof registered[0].dicts.en.title, 'string');
  assert.equal(registrations[0].options.locale, 'remote-nav');
  assert.equal(registrations[0].options.label(), 'remote-nav.title');
});

test('重复 apply 同一 ctx 不会重复挂载', () => {
  const { sandbox, getCaptured } = createSandbox();
  const plugin = getCaptured().factory(() => FakeReact);
  const { ctx, registrations } = fakeCtx();
  plugin.apply(ctx);
  const first = sandbox.dshNav;
  plugin.apply(ctx);
  assert.equal(sandbox.dshNav, first);
  assert.equal(registrations.length, 1, '重复 apply 不应重复注册 slot');
});
