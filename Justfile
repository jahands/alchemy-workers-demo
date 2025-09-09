# This Justfile isn't strictly necessary, but it's
# a convenient way to run commands in the repo
# without needing to remember all commands.

[private]
@help:
  just --list

# Aliases
alias new-pkg := new-package
alias new-worker := gen
alias up := update
alias i := install


# =============================== #
#         DEV COMMANDS            #
# =============================== #

# Install dependencies
[group('1. dev')]
install:
  pnpm install --child-concurrency=10

# Check for issues with deps, lint, types, format, etc.
[group('1. dev')]
[no-cd]
check *flags:
  bun runx check {{flags}}

# Fix issues with deps, lint, format, etc.
[group('1. dev')]
[no-cd]
fix *flags:
  bun runx fix {{flags}}

[group('1. dev')]
[no-cd]
test *flags:
  bun vitest {{flags}}

[group('1. dev')]
[no-cd]
build *flags:
  bun turbo build {{flags}}

# =============================== #
#       LOCAL DEV COMMANDS        #
# =============================== #

# Run dev script. Runs turbo dev if not in a specific project directory.
[group('2. local dev')]
dev *flags:
  cd infra/alchemy && bun alchemy dev

# Run Workers in preview mode (if available)
[group('2. local dev')]
[no-cd]
preview:
  bun run preview

# =============================== #
#        DEPLOY COMMANDS          #
# =============================== #

[group('3. deploy')]
[no-cd]
deploy:
  cd infra/alchemy && bun alchemy deploy --stage=prod

# =============================== #
#       GENERATOR COMMANDS        #
# =============================== #

# Create changeset
[group('4. generator')]
cs:
  bun run-changeset-new

[group('4. generator')]
gen *flags:
  bun run-turbo-gen {{flags}}

[group('4. generator')]
new-package *flags:
  bun run-turbo-gen new-package {{flags}}

# =============================== #
#        UTILITY COMMANDS         #
# =============================== #

# CLI in packages/tools for updating deps, pnpm, etc.
[group('5. utility')]
update *flags:
  bun runx update {{flags}}

# CLI in packages/tools for running commands in the repo.
[group('5. utility')]
runx *flags:
  bun runx {{flags}}
