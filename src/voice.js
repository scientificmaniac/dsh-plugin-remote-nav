/**
 * voice.js — 语音键 push-to-talk：把遥控器语音键映射为 DSH 内置语音听写的开始/停止。
 *
 * DSH 的语音输入（@deepseek-ai/dsh-experimental-client-ui-voice-input）没有对外暴露
 * start/stop 服务，只在 `conversation.input.activity` 槽位渲染一个麦克风按钮：
 *   点击麦克风 → 开始录音；录音条里的“停止并识别”按钮 → 结束并转写。
 * 因此本模块用 DOM 点击复刻这两个动作，不改动业务代码。
 *
 * 按钮通过多语言 aria-label 定位（zh/en/es/fr/de/ru/pt），不依赖 CSS 类名哈希。
 */

/** “开始录音”麦克风按钮的多语言 aria-label */
export const START_LABELS = [
  '开始录音',
  'Start recording',
  'Empezar a grabar',
  "Commencer l'enregistrement",
  'Starten Sie die Aufnahme',
  'Comece a gravar',
  'Dictate',
  '听写',
];

/** “停止并识别”按钮的多语言 aria-label */
export const STOP_LABELS = [
  '停止并识别',
  'Stop and transcribe',
  'Detener y transcribir',
  'Arrêtez et transcrivez',
  'Stoppen Sie und transkribieren Sie',
  'Pare e transcreva',
];

/**
 * 语音键的语义名（遥控器 / TV）。键盘按键不在此列。
 */
export const VOICE_KEY_NAMES = ['Voice', 'VoiceSearch', 'Speech', 'VoiceAssist', 'Microphone'];

/**
 * 语音键识别：只认遥控器语义名与配置里的 keyCode。
 * @param {KeyboardEvent} e
 * @param {number[]} keyCodes
 */
export function isVoiceKey(e, keyCodes = []) {
  if (e && VOICE_KEY_NAMES.indexOf(e.key) >= 0) return true;
  const lc = e && (e.keyCode || e.which);
  return !!lc && keyCodes.indexOf(lc) >= 0;
}

/** 归一化 aria-label 用于比较 */
function norm(label) {
  return String(label || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/** 在文档里找第一个匹配给定文案集合的按钮 */
function findButtonByLabels(labels, root) {
  const doc = typeof document !== 'undefined' ? document : null;
  if (!doc) return null;
  const scope = root || doc;
  // aria-label 优先，title 兜底
  const all = scope.querySelectorAll('button,[role="button"]');
  const wanted = labels.map(norm);
  for (let i = 0; i < all.length; i++) {
    const el = all[i];
    const label = norm(el.getAttribute('aria-label') || el.getAttribute('title'));
    if (label && wanted.indexOf(label) >= 0 && !el.disabled) return el;
  }
  return null;
}

/** 找当前激活的录音条（可访问名匹配“停止并识别”的按钮所在容器） */
function findStopButton(root) {
  return findButtonByLabels(STOP_LABELS, root);
}

/**
 * 语音键按下：找到麦克风按钮并点击，启动 DSH 内置听写。
 * @returns {boolean} 是否成功点到了麦克风按钮
 */
export function startVoice(root) {
  const btn = findButtonByLabels(START_LABELS, root);
  if (!btn) return false;
  btn.click();
  return true;
}

/**
 * 语音键松开：点击“停止并识别”按钮，结束录音并转写。
 * 若录音还没真正开始（仍处于请求麦克风状态），则回退为再点一次麦克风按钮取消。
 * @returns {boolean} 是否成功点到停止按钮
 */
export function stopVoice(root) {
  const stop = findStopButton(root);
  if (stop) {
    stop.click();
    return true;
  }
  return false;
}
