import { existsSync, mkdirSync, cpSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT = join(__dirname, '..', 'content');
const HOME = homedir();

const AGENTS = {
  'claude-code': {
    name: 'Claude Code',
    detect: () => existsSync(join(HOME, '.claude')),
    projectDir: '.claude/skills/pds',
    globalDir: join(HOME, '.claude', 'skills', 'pds'),
    content: 'claude-code',
  },
  'antigravity': {
    name: 'Antigravity',
    detect: () => existsSync('.agent') || existsSync(join(HOME, '.gemini', 'antigravity')),
    projectDir: '.agent/skills/pds',
    globalDir: join(HOME, '.gemini', 'antigravity', 'skills', 'pds'),
    workflowProjectDir: '.agent/workflows',
    workflowGlobalDir: join(HOME, '.gemini', 'antigravity', 'global_workflows'),
    content: 'antigravity',
  },
  'cursor': {
    name: 'Cursor',
    detect: () => existsSync(join(HOME, '.cursor')),
    projectDir: '.cursor/skills/pds',
    globalDir: join(HOME, '.cursor', 'skills', 'pds'),
    content: 'universal',
  },
  'windsurf': {
    name: 'Windsurf',
    detect: () => existsSync(join(HOME, '.codeium', 'windsurf')),
    projectDir: '.windsurf/skills/pds',
    globalDir: join(HOME, '.codeium', 'windsurf', 'skills', 'pds'),
    content: 'universal',
  },
};

function parseArgs(args) {
  const opts = { agents: [], global: false, help: false };
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

function installForAgent(agentId, agent, global) {
  const skillDir = global ? agent.globalDir : join(process.cwd(), agent.projectDir);
  const contentDir = join(CONTENT, agent.content);
  const refsDir = join(CONTENT, 'references');
  const installed = [];

  // Copy SKILL.md
  mkdirSync(skillDir, { recursive: true });
  cpSync(join(contentDir, 'SKILL.md'), join(skillDir, 'SKILL.md'));
  installed.push(`  skill  -> ${global ? agent.globalDir : agent.projectDir}/SKILL.md`);

  // Copy references
  const refsTarget = join(skillDir, 'references');
  copyDir(refsDir, refsTarget);
  installed.push(`  refs   -> ${global ? agent.globalDir : agent.projectDir}/references/`);

  // Copy workflow (Antigravity only)
  if (agent.workflowProjectDir) {
    const workflowSrc = join(contentDir, 'workflow.md');
    if (existsSync(workflowSrc)) {
      const wfDir = global ? agent.workflowGlobalDir : join(process.cwd(), agent.workflowProjectDir);
      mkdirSync(wfDir, { recursive: true });
      cpSync(workflowSrc, join(wfDir, 'pds.md'));
      installed.push(`  /pds   -> ${global ? agent.workflowGlobalDir : agent.workflowProjectDir}/pds.md`);
    }
  }

  return installed;
}

export function install(args) {
  const opts = parseArgs(args);

  if (opts.help) {
    console.log(`
  pencil-design-system — Install the PDS skill across AI editors

  Usage:
    npx pencil-design-system                   Auto-detect and install
    npx pencil-design-system -a claude-code    Install to specific editor
    npx pencil-design-system -a antigravity    Install to Antigravity
    npx pencil-design-system --global          Install to global paths

  Options:
    -a, --agent <name>   Target editor (claude-code, antigravity, cursor, windsurf)
    -g, --global         Install to global paths (~/.claude/, ~/.gemini/, etc.)
    -h, --help           Show this help

  Supported editors:
    claude-code    .claude/skills/pds/          + /pds slash command
    antigravity    .agent/skills/pds/           + .agent/workflows/pds.md
    cursor         .cursor/skills/pds/
    windsurf       .windsurf/skills/pds/
`);
    return;
  }

  console.log('\n  Pencil Design System Installer\n');

  // Detect or use specified agents
  let targets;
  if (opts.agents.length > 0) {
    targets = opts.agents.filter(a => AGENTS[a]);
    const unknown = opts.agents.filter(a => !AGENTS[a]);
    if (unknown.length) {
      console.log(`  Unknown agent(s): ${unknown.join(', ')}`);
      console.log(`  Available: ${Object.keys(AGENTS).join(', ')}\n`);
    }
  } else {
    targets = Object.keys(AGENTS).filter(id => AGENTS[id].detect());
    if (targets.length === 0) {
      console.log('  No editors detected. Use --agent to specify:\n');
      console.log('    npx pencil-design-system --agent claude-code');
      console.log('    npx pencil-design-system --agent antigravity\n');
      console.log(`  Available: ${Object.keys(AGENTS).join(', ')}\n`);
      return;
    }
  }

  const scope = opts.global ? 'global' : 'project';
  console.log(`  Installing to ${targets.length} editor(s) (${scope}):\n`);

  for (const id of targets) {
    const agent = AGENTS[id];
    console.log(`  ${agent.name}`);
    try {
      const lines = installForAgent(id, agent, opts.global);
      lines.forEach(l => console.log(l));
    } catch (err) {
      console.log(`  error: ${err.message}`);
    }
    console.log();
  }

  console.log('  Done! Type /pds in your editor to get started.\n');
}
