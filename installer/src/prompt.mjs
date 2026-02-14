import { emitKeypressEvents } from 'node:readline';

// ANSI escape helpers
const ESC = '\x1B';
const HIDE_CURSOR = `${ESC}[?25l`;
const SHOW_CURSOR = `${ESC}[?25h`;
const CLEAR_LINE = `${ESC}[2K`;
const MOVE_UP = (n) => `${ESC}[${n}A`;
const BOLD = (s) => `${ESC}[1m${s}${ESC}[0m`;
const DIM = (s) => `${ESC}[2m${s}${ESC}[0m`;
const GREEN = (s) => `${ESC}[32m${s}${ESC}[0m`;
const CYAN = (s) => `${ESC}[36m${s}${ESC}[0m`;
const YELLOW = (s) => `${ESC}[33m${s}${ESC}[0m`;

/**
 * Interactive multi-select checkbox prompt.
 * Arrow keys to navigate, space to toggle, enter to confirm.
 *
 * @param {string} message - The prompt question
 * @param {Array<{label: string, value: string, checked?: boolean, hint?: string}>} choices
 * @returns {Promise<string[]>} - Selected values
 */
export function multiSelect(message, choices) {
  return new Promise((resolve) => {
    let cursor = 0;
    const selected = new Set(choices.map((c, i) => c.checked ? i : -1).filter(i => i >= 0));
    let rendered = false;

    function render() {
      const out = process.stdout;
      if (rendered) {
        out.write(MOVE_UP(choices.length));
      }
      for (let i = 0; i < choices.length; i++) {
        const c = choices[i];
        const pointer = i === cursor ? CYAN('❯') : ' ';
        const check = selected.has(i) ? GREEN('◉') : DIM('○');
        const label = i === cursor ? BOLD(c.label) : c.label;
        const hint = c.hint ? DIM(` (${c.hint})`) : '';
        out.write(`${CLEAR_LINE}  ${pointer} ${check} ${label}${hint}\n`);
      }
      rendered = true;
    }

    process.stdout.write(`\n  ${BOLD(message)} ${DIM('(↑↓ navigate, space toggle, enter confirm)')}\n\n`);
    process.stdout.write(HIDE_CURSOR);
    render();

    emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    process.stdin.resume();

    function onKeypress(_, key) {
      if (!key) return;

      if (key.name === 'up' || key.name === 'k') {
        cursor = (cursor - 1 + choices.length) % choices.length;
        render();
      } else if (key.name === 'down' || key.name === 'j') {
        cursor = (cursor + 1) % choices.length;
        render();
      } else if (key.name === 'space') {
        if (selected.has(cursor)) selected.delete(cursor);
        else selected.add(cursor);
        render();
      } else if (key.name === 'a') {
        // Toggle all
        if (selected.size === choices.length) selected.clear();
        else choices.forEach((_, i) => selected.add(i));
        render();
      } else if (key.name === 'return') {
        cleanup();
        const result = [...selected].sort().map(i => choices[i].value);
        resolve(result);
      } else if (key.name === 'escape' || (key.ctrl && key.name === 'c')) {
        cleanup();
        process.stdout.write(SHOW_CURSOR);
        process.exit(0);
      }
    }

    function cleanup() {
      process.stdin.removeListener('keypress', onKeypress);
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write(SHOW_CURSOR);

      // Rewrite final state with checks
      process.stdout.write(MOVE_UP(choices.length));
      for (let i = 0; i < choices.length; i++) {
        const c = choices[i];
        const check = selected.has(i) ? GREEN('✔') : DIM('·');
        const label = selected.has(i) ? c.label : DIM(c.label);
        const hint = c.hint ? DIM(` (${c.hint})`) : '';
        process.stdout.write(`${CLEAR_LINE}  ${check} ${label}${hint}\n`);
      }
      process.stdout.write('\n');
    }

    process.stdin.on('keypress', onKeypress);
  });
}

/**
 * Interactive single-select radio prompt.
 * Arrow keys to navigate, enter to confirm.
 */
export function singleSelect(message, choices) {
  return new Promise((resolve) => {
    let cursor = choices.findIndex(c => c.checked) || 0;
    let rendered = false;

    function render() {
      const out = process.stdout;
      if (rendered) {
        out.write(MOVE_UP(choices.length));
      }
      for (let i = 0; i < choices.length; i++) {
        const c = choices[i];
        const pointer = i === cursor ? CYAN('❯') : ' ';
        const radio = i === cursor ? GREEN('●') : DIM('○');
        const label = i === cursor ? BOLD(c.label) : c.label;
        const hint = c.hint ? DIM(` ${c.hint}`) : '';
        out.write(`${CLEAR_LINE}  ${pointer} ${radio} ${label}${hint}\n`);
      }
      rendered = true;
    }

    process.stdout.write(`\n  ${BOLD(message)}\n\n`);
    process.stdout.write(HIDE_CURSOR);
    render();

    emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    process.stdin.resume();

    function onKeypress(_, key) {
      if (!key) return;

      if (key.name === 'up' || key.name === 'k') {
        cursor = (cursor - 1 + choices.length) % choices.length;
        render();
      } else if (key.name === 'down' || key.name === 'j') {
        cursor = (cursor + 1) % choices.length;
        render();
      } else if (key.name === 'return') {
        cleanup();
        resolve(choices[cursor].value);
      } else if (key.name === 'escape' || (key.ctrl && key.name === 'c')) {
        cleanup();
        process.stdout.write(SHOW_CURSOR);
        process.exit(0);
      }
    }

    function cleanup() {
      process.stdin.removeListener('keypress', onKeypress);
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write(SHOW_CURSOR);

      // Show final selection
      process.stdout.write(MOVE_UP(choices.length));
      for (let i = 0; i < choices.length; i++) {
        const c = choices[i];
        const radio = i === cursor ? GREEN('●') : DIM('○');
        const label = i === cursor ? BOLD(c.label) : DIM(c.label);
        process.stdout.write(`${CLEAR_LINE}  ${radio} ${label}\n`);
      }
      process.stdout.write('\n');
    }

    process.stdin.on('keypress', onKeypress);
  });
}

export function banner(version) {
  console.log(`
  ${BOLD(CYAN('╭───────────────────────────────────────────╮'))}
  ${BOLD(CYAN('│'))}  ${BOLD('Pencil Design System')}   ${DIM(`v${version}`)}          ${BOLD(CYAN('│'))}
  ${BOLD(CYAN('│'))}  ${DIM('AI-powered design system generator')}       ${BOLD(CYAN('│'))}
  ${BOLD(CYAN('│'))}  ${DIM('by JSS Tech Services')}                    ${BOLD(CYAN('│'))}
  ${BOLD(CYAN('╰───────────────────────────────────────────╯'))}
  `);
}
