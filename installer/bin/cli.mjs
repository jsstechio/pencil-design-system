#!/usr/bin/env node
import { install } from '../src/install.mjs';
install(process.argv.slice(2)).catch(err => {
  console.error(`\n  Error: ${err.message}\n`);
  process.exit(1);
});
