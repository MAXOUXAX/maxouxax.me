import fs from "fs";

// Get the commit message file path from the command line arguments
const commitMsgFile = process.argv[2];
if (!commitMsgFile) {
  console.error("Error: No commit message file path provided.");
  process.exit(1);
}

// Read the commit message
const commitMsg = fs.readFileSync(commitMsgFile, "utf8").trim();

// Get the first line (the commit subject) and strip leading/trailing spaces
const firstLine = commitMsg.split("\n")[0]?.trim() ?? "";

// If the first line is empty (e.g. aborting commit), we let git handle it
if (!firstLine) {
  process.exit(0);
}

// Regular expression for Conventional Commits
// Allowed types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
// Allowed optional scope: (scope)
// Allowed optional breaking change indicator: !
// Must have a colon followed by a space, then the description
const commitRegex =
  /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?(!)?:\s.+$/;

// Allow standard git merge, conflict resolution, or revert messages as well
const isMerge = /^Merge\s.+/.test(firstLine);
const isRevert = /^Revert\s.+/.test(firstLine);

if (!commitRegex.test(firstLine) && !isMerge && !isRevert) {
  console.error(`
\x1b[31mError: Invalid commit message format.\x1b[0m

Your commit message: "\x1b[33m${firstLine}\x1b[0m" does not match the Conventional Commits specification.

\x1b[32mConventional Commits format:\x1b[0m
  \x1b[36m<type>(<scope>)?: <description>\x1b[0m

\x1b[32mAllowed types:\x1b[0m
  - \x1b[35mfeat\x1b[0m: A new feature
  - \x1b[35mfix\x1b[0m: A bug fix
  - \x1b[35mdocs\x1b[0m: Documentation only changes
  - \x1b[35mstyle\x1b[0m: Changes that do not affect the meaning of the code (white-space, formatting, etc)
  - \x1b[35mrefactor\x1b[0m: A code change that neither fixes a bug nor adds a feature
  - \x1b[35mperf\x1b[0m: A code change that improves performance
  - \x1b[35mtest\x1b[0m: Adding missing tests or correcting existing tests
  - \x1b[35mbuild\x1b[0m: Changes that affect the build system or external dependencies
  - \x1b[35mci\x1b[0m: Changes to our CI configuration files and scripts
  - \x1b[35mchore\x1b[0m: Other changes that don't modify src or test files
  - \x1b[35mrevert\x1b[0m: Reverts a previous commit

\x1b[32mExamples:\x1b[0m
  - \x1b[36mfeat(navigation): add mobile sidebar menu\x1b[0m
  - \x1b[36mfix(api): handle empty input error\x1b[0m
  - \x1b[36mdocs: update installation instructions in README\x1b[0m
  `);
  process.exit(1);
}
