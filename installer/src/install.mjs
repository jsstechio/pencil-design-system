import { existsSync, mkdirSync, cpSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { multiSelect, singleSelect, banner } from './prompt.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT = join(__dirname, '..', 'dist');
const HOME = homedir();
const VERSION = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8')).version;

const COLLECTUI_MCP = {
  command: 'npx',
  args: ['-y', 'collectui-mcp'],
};

const AGENTS = {
  'claude-code': {
    name: 'Claude Code',
    detect: () => existsSync(join(HOME, '.claude')),
    projectDir: '.claude/skills/pds',
    globalDir: join(HOME, '.claude', 'skills', 'pds'),
    content: 'claude-code',
    mcpGlobal: join(HOME, '.claude', '.mcp.json'),
  },
  'antigravity': {
    name: 'Antigravity',
    detect: () => existsSync('.agent') || existsSync(join(HOME, '.gemini', 'antigravity')),
    projectDir: '.agent/skills/pds',
    globalDir: join(HOME, '.gemini', 'antigravity', 'skills', 'pds'),
    workflowProjectDir: '.agent/workflows',
    workflowGlobalDir: join(HOME, '.gemini', 'antigravity', 'global_workflows'),
    content: 'antigravity',
    mcpGlobal: join(HOME, '.gemini', 'antigravity', 'mcp_config.json'),
  },
  'cursor': {
    name: 'Cursor',
    detect: () => existsSync(join(HOME, '.cursor')),
    projectDir: '.cursor/skills/pds',
    globalDir: join(HOME, '.cursor', 'skills', 'pds'),
    content: 'universal',
    mcpGlobal: join(HOME, '.cursor', 'mcp.json'),
  },
  'windsurf': {
    name: 'Windsurf',
    detect: () => existsSync(join(HOME, '.codeium', 'windsurf')),
    projectDir: '.windsurf/skills/pds',
    globalDir: join(HOME, '.codeium', 'windsurf', 'skills', 'pds'),
    content: 'universal',
    mcpGlobal: join(HOME, '.codeium', 'windsurf', 'mcp_config.json'),
  },
};

function parseArgs(args) {
  const opts = { agents: [], global: false, help: false, interactive: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--agent' || args[i] === '-a') {
      opts.agents.push(args[++i]);
    } else if (args[i] === '--global' || args[i] === '-g') {
      opts.global = true;
    } else if (args[i] === '--help' || args[i] === '-h') {
      opts.help = true;
    }
  }
  return opts;
}

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, { recursive: true });
}

function configureMcp(agent) {
  if (!agent.mcpGlobal) return null;
  const configPath = agent.mcpGlobal;

  let config = {};
  if (existsSync(configPath)) {
    try {
      config = JSON.parse(readFileSync(configPath, 'utf-8'));
    } catch {
      config = {};
    }
  }

  if (!config.mcpServers) config.mcpServers = {};
  if (config.mcpServers.collectui) return 'exists';

  config.mcpServers.collectui = COLLECTUI_MCP;
  mkdirSync(dirname(configPath), { recursive: true });
  writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
  return configPath;
}

function installForAgent(agentId, agent, global) {
  const skillDir = global ? agent.globalDir : join(process.cwd(), agent.projectDir);
  const contentDir = join(CONTENT, agent.content);
  const refsDir = join(CONTENT, 'references');
  const installed = [];

  mkdirSync(skillDir, { recursive: true });
  cpSync(join(contentDir, 'SKILL.md'), join(skillDir, 'SKILL.md'));
  installed.push(`    skill  → ${global ? agent.globalDir : agent.projectDir}/SKILL.md`);

  const refsTarget = join(skillDir, 'references');
  copyDir(refsDir, refsTarget);
  installed.push(`    refs   → ${global ? agent.globalDir : agent.projectDir}/references/`);

  if (agent.workflowProjectDir) {
    const workflowSrc = join(contentDir, 'workflow.md');
    if (existsSync(workflowSrc)) {
      const wfDir = global ? agent.workflowGlobalDir : join(process.cwd(), agent.workflowProjectDir);
      mkdirSync(wfDir, { recursive: true });
      cpSync(workflowSrc, join(wfDir, 'pds.md'));
      installed.push(`    /pds   → ${global ? agent.workflowGlobalDir : agent.workflowProjectDir}/pds.md`);
    }
  }

  try {
    const mcpResult = configureMcp(agent);
    if (mcpResult === 'exists') {
      installed.push(`    mcp    → collectui already configured`);
    } else if (mcpResult) {
      installed.push(`    mcp    → collectui added to ${mcpResult}`);
    }
  } catch (err) {
    installed.push(`    mcp    → skipped (${err.message})`);
  }

  return installed;
}

function runInstall(targets, global) {
  const scope = global ? 'global' : 'project';
  console.log(`  Installing to ${targets.length} editor(s) (${scope}):\n`);

  for (const id of targets) {
    const agent = AGENTS[id];
    console.log(`  \x1B[1m${agent.name}\x1B[0m`);
    try {
      const lines = installForAgent(id, agent, global);
      lines.forEach(l => console.log(l));
    } catch (err) {
      console.log(`    error: ${err.message}`);
    }
    console.log();
  }

  console.log('  \x1B[32m✔\x1B[0m Done! Type \x1B[1m/pds\x1B[0m in your editor to get started.\n');
}

async function interactiveInstall() {
  banner(VERSION);

  // Build choices with detection hints
  const editorChoices = Object.entries(AGENTS).map(([id, agent]) => {
    const detected = agent.detect();
    return {
      label: agent.name,
      value: id,
      checked: detected,
      hint: detected ? 'detected' : undefined,
    };
  });

  const selectedEditors = await multiSelect('Select editors to install:', editorChoices);

  if (selectedEditors.length === 0) {
    console.log('  No editors selected. Nothing to install.\n');
    return;
  }

  const scope = await singleSelect('Install scope:', [
    { label: 'Project', value: 'project', hint: '(current directory)', checked: true },
    { label: 'Global', value: 'global', hint: '(~/.claude, ~/.gemini, etc.)' },
  ]);

  runInstall(selectedEditors, scope === 'global');
}

export async function install(args) {
  const opts = parseArgs(args);

  if (opts.help) {
    console.log(`
  \x1B[1mpencil-design-system\x1B[0m — Install the PDS skill across AI editors

  \x1B[1mUsage:\x1B[0m
    npx pencil-design-system                   Interactive mode (recommended)
    npx pencil-design-system -a claude-code    Install to specific editor
    npx pencil-design-system -a antigravity    Install to Antigravity
    npx pencil-design-system --global          Install to global paths

  \x1B[1mOptions:\x1B[0m
    -a, --agent <name>   Target editor (claude-code, antigravity, cursor, windsurf)
    -g, --global         Install to global paths (~/.claude/, ~/.gemini/, etc.)
    -h, --help           Show this help

  \x1B[1mSupported editors:\x1B[0m
    claude-code    .claude/skills/pds/          + /pds slash command
    antigravity    .agent/skills/pds/           + .agent/workflows/pds.md
    cursor         .cursor/skills/pds/
    windsurf       .windsurf/skills/pds/
`);
    return;
  }

  // Non-interactive mode: --agent flag provided
  if (opts.agents.length > 0) {
    const targets = opts.agents.filter(a => AGENTS[a]);
    const unknown = opts.agents.filter(a => !AGENTS[a]);
    if (unknown.length) {
      console.log(`\n  Unknown editor(s): ${unknown.join(', ')}`);
      console.log(`  Available: ${Object.keys(AGENTS).join(', ')}\n`);
    }
    if (targets.length > 0) {
      console.log(`\n  \x1B[1mPencil Design System Installer\x1B[0m v${VERSION}\n`);
      runInstall(targets, opts.global);
    }
    return;
  }

  // Interactive mode: no flags, TTY available
  if (process.stdin.isTTY) {
    await interactiveInstall();
    return;
  }

  // Fallback: non-TTY, auto-detect
  console.log(`\n  \x1B[1mPencil Design System Installer\x1B[0m v${VERSION}\n`);
  const targets = Object.keys(AGENTS).filter(id => AGENTS[id].detect());
  if (targets.length === 0) {
    console.log('  No editors detected. Use --agent to specify:\n');
    console.log('    npx pencil-design-system --agent claude-code');
    console.log('    npx pencil-design-system --agent antigravity\n');
    console.log(`  Available: ${Object.keys(AGENTS).join(', ')}\n`);
    return;
  }
  runInstall(targets, opts.global);
}
