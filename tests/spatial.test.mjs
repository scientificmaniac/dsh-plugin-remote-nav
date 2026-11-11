/**
 * 空间寻路纯函数单测（不依赖浏览器）：node --test tests/
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { pickDirectional, pickWrap, pickEntry, scrollForce } from '../src/remote-nav.js';

const CFG = { crossAxisWeight: 2.2, alignmentSlack: 64, wrapCrossSlack: 96 };

/** 构造 rect，便于手写用例 */
function r(id, left, top, width = 100, height = 40) {
  return {
    el: { id },
    left,
    top,
    right: left + width,
    bottom: top + height,
    cx: left + width / 2,
    cy: top + height / 2,
    w: width,
    h: height,
  };
}

/** 3x3 网格：每格 100x40，间距 20 */
function makeGrid() {
  const out = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      out.push(r(`g${row}${col}`, col * 120, row * 60));
    }
  }
  return out;
}

const byId = (rect) => (rect ? rect.el.id : null);

test('网格内向右移动命中同一行右邻，而非 DOM 下一个', () => {
  const grid = makeGrid();
  const cur = grid[4]; // g11 居中
  const cands = grid.filter((x) => x !== cur).reverse(); // 故意反转顺序
  assert.equal(byId(pickDirectional('right', cur, cands, CFG)), 'g12');
});

test('向右移动不会跳到下一行（副轴权重生效）', () => {
  const grid = makeGrid();
  const cur = grid[5]; // g12 最右
  const cands = grid.filter((x) => x !== cur);
  // 严格意义上右侧没有元素 → null（即使 g20 的 cx 比当前更靠右一点点也不该被选中）
  assert.equal(pickDirectional('right', cur, cands, CFG), null);
});

test('向下移动越过间隙命中下一行同列', () => {
  const grid = makeGrid();
  const cur = grid[1]; // g01
  const cands = grid.filter((x) => x !== cur);
  assert.equal(byId(pickDirectional('down', cur, cands, CFG)), 'g11');
});

test('边界：wrap=false 返回 null，wrap=true 回到同行最左', () => {
  const grid = makeGrid();
  const cur = grid[5]; // g12
  const cands = grid.filter((x) => x !== cur);
  assert.equal(pickWrap('right', cur, cands, CFG).el.id, 'g10');
});

test('对齐优先：对齐但更远的元素胜过错位但更近的元素', () => {
  const cur = r('cur', 0, 0, 100, 40);
  const alignedFar = r('aligned', 400, 0); // 同一条线，间隙 300
  const misalignedNear = r('messy', 120, 300); // 很近但错位 260
  const picked = pickDirectional('right', cur, [misalignedNear, alignedFar], CFG);
  assert.equal(picked.el.id, 'aligned');
});

test('仅行首存在元素时，从行尾向右仍可循环', () => {
  const cur = r('tail', 800, 0);
  const head = r('head', 0, 0);
  assert.equal(pickWrap('right', cur, [head], CFG).el.id, 'head');
});

test('入口：左上策略按行聚类后取第一行最左', () => {
  const shuffled = [r('c', 240, 0), r('b', 120, 0), r('a', 0, 0), r('z', 0, 200)];
  assert.equal(byId(pickEntry(shuffled, 'top-left', { width: 1280, height: 720 })), 'a');
});

test('入口：DOM 顺序策略', () => {
  const arr = [r('c', 240, 0), r('b', 120, 0)];
  assert.equal(byId(pickEntry(arr, 'dom-first', { width: 1280, height: 720 })), 'c');
});

test('空候选集不抛异常', () => {
  assert.equal(pickDirectional('up', r('cur', 0, 0), [], CFG), null);
  assert.equal(pickWrap('up', r('cur', 0, 0), [], CFG), null);
  assert.equal(pickEntry([], 'top-left', {}), null);
});

test('完全重叠的两个元素不会互相选中（防死锁）', () => {
  const cur = r('cur', 0, 0);
  const same = r('same', 0, 0);
  assert.equal(pickDirectional('right', cur, [same], CFG), null);
  assert.equal(pickDirectional('down', cur, [same], CFG), null);
});

test('长按加速：从 1x 线性加速到上限后保持', () => {
  const cfg = { scrollAccelMax: 3, scrollAccelRampMs: 900 };
  assert.equal(scrollForce(0, cfg), 1);
  assert.equal(scrollForce(450, cfg), 2);
  assert.equal(scrollForce(900, cfg), 3);
  assert.equal(scrollForce(5000, cfg), 3);
});

test('长按加速：上限为 1 时恒为 1x，负时长不产生减速', () => {
  assert.equal(scrollForce(5000, { scrollAccelMax: 1, scrollAccelRampMs: 100 }), 1);
  assert.equal(scrollForce(-500, { scrollAccelMax: 3, scrollAccelRampMs: 900 }), 1);
});
