---
description: Merges development branch to main and releases new version
---

# /deploy-main

Merges development branch to main and releases a new version.

> **Project Type**: Idea Generator (Claude AI Agent Configuration)
> **Note**: Run from development branch.

---

## Steps

### 0. Sync development with main (CRITICAL)

**Before making any changes, sync development with latest main:**

```bash
git fetch origin main
git merge origin/main --no-edit
git push origin development
```

If conflicts occur:
```bash
git add .
git commit -m "chore: merge main into development"
git push origin development
```

---

### 1. Version Input

Ask user for version number:

```
📦 Create New Release

Enter version number (e.g., 0.1.0, 1.0.0, 1.2.3):
  - Major.Minor.Patch format
  - Examples:
    • 0.1.0 - Initial release
    • 1.0.0 - First stable version
    • 1.1.0 - New features added
    • 1.0.1 - Bug fixes
```

Store version as: `v{version}` (e.g., `v1.0.0`)

---

### 2. Create PR

Review changes and create pull request:

```bash
# Review changes since main
git log origin/main..HEAD --oneline
git diff origin/main...HEAD --stat

# Create PR
gh pr create \
  --base main \
  --head development \
  --title "chore: Release v{version}" \
  --body "$(cat <<'EOF'
## Changes

{List major changes based on commit messages}

### ✨ New Features
- {feat commits}

### 🐛 Bug Fixes
- {fix commits}

### 📝 Documentation
- {docs commits}

### 🔧 Other Work
- v{version} version update

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Categorize commits:
- `feat:` commits → ✨ New Features
- `fix:` commits → 🐛 Bug Fixes
- `refactor:` commits → 🔧 Refactoring
- `docs:` commits → 📝 Documentation
- `chore:` commits → 🔧 Other Work

---

### 3. PR Merge

```bash
gh pr review {PR_number} --approve
gh pr merge {PR_number} --merge --delete-branch=false
```

**Important**: Use `--delete-branch=false` to keep development branch

---

### 4. Sync development with main

**After successful merge to main, sync development:**

```bash
git checkout development
git pull origin main
git push origin development
```

---

### 5. Git Tag & GitHub Release

```bash
git checkout main
git pull origin main

# Create tag
git tag v{version} -a -m "Release v{version}"
git push origin v{version}

# Get previous tag
PREV_TAG=$(git describe --tags --abbrev=0 HEAD^ 2>/dev/null || echo "")

# Create GitHub release
gh release create "v{version}" \
  --title "v{version}" \
  --notes "$(cat <<'EOF'
## Changes

### ✨ New Features
- {feat commits summary}

### 🐛 Bug Fixes
- {fix commits summary}

### 📝 Documentation
- {docs commits summary}

### 🔧 Other Work
- {other commits summary}

---

**Full Changelog**: https://github.com/{org}/{repo}/compare/{prev_tag}...v{version}

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

**Note**: If no previous tag exists, use:
```
**Full Changelog**: https://github.com/{org}/{repo}/commits/v{version}
```

---

### 6. Completion Message

```
✅ Release complete!

📦 Version: v{version}
🏷️ Tag: v{version}
🌿 Branch: main (deployed)
📋 PR: #{number} (merged)
📄 Release: https://github.com/{org}/{repo}/releases/tag/v{version}

🎉 Deployment complete!
```

---

## Flow Diagram

```
/deploy-main execution
        ↓
┌───────────────────────────────────────┐
│ 0. Sync development with main         │
│    - git fetch origin main            │
│    - git merge origin/main            │
│    - git push origin development      │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│ 1. Get version number from user       │
│    - Ask for version (e.g., 1.0.0)    │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│ 2. Create PR (development → main)     │
│    - Review changes                   │
│    - gh pr create                     │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│ 3. Merge PR                           │
│    - gh pr review --approve           │
│    - gh pr merge                      │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│ 4. Sync development with main         │
│    - git checkout development         │
│    - git pull origin main             │
│    - git push origin development      │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│ 5. Create tag & release               │
│    - git tag v{version}               │
│    - git push origin v{version}       │
│    - gh release create                │
└───────────────────────────────────────┘
        ↓
    ✅ Complete!
```

---

## Important Rules

1. ✅ **Always run from development branch**
2. ✅ **Sync development with main first** (Step 0)
3. ✅ **Use semantic versioning** (Major.Minor.Patch)
4. 📝 **Categorize commits** in PR and release notes
5. 🔄 **Sync development after merge** (Step 4)
6. 🔗 **Include full changelog link**
7. 🚫 **Never delete development branch**
8. 🚫 **Never delete tags** after pushing

---

## Version Numbering Guide

### Semantic Versioning (MAJOR.MINOR.PATCH)

- **PATCH** (0.0.X): Bug fixes, small changes
  - Example: `1.0.0 → 1.0.1`
  - When: Fix agent specification errors, typos, minor improvements

- **MINOR** (0.X.0): New features, backward compatible
  - Example: `1.0.0 → 1.1.0`
  - When: Add new agents, new commands, enhance existing features

- **MAJOR** (X.0.0): Breaking changes
  - Example: `1.5.3 → 2.0.0`
  - When: Restructure project, incompatible changes, major overhaul

---

## Example

```bash
/deploy-main
```

### Execution Flow
```
1️⃣ Syncing development with main...
   ✅ Fetched origin/main
   ✅ Merged into development
   ✅ Pushed to origin/development

2️⃣ Enter version number: 1.0.0

3️⃣ Creating PR...

   Changes (3 commits):
   - feat: Add competitor-analyzer agent improvements
   - fix: Fix JSON syntax in settings
   - docs: Update README with examples

   ✅ PR created: #12
   🔗 https://github.com/{org}/{repo}/pull/12

4️⃣ Merging PR...
   ✅ Approved PR #12
   ✅ Merged to main

5️⃣ Syncing development with main...
   ✅ Switched to development
   ✅ Pulled from origin/main
   ✅ Pushed to origin/development

6️⃣ Creating tag & release...
   ✅ Tag created: v1.0.0
   ✅ Pushed to origin
   ✅ Release created: v1.0.0

   📄 https://github.com/{org}/{repo}/releases/tag/v1.0.0

✅ Release complete!

📦 Version: v1.0.0
🏷️ Tag: v1.0.0
🌿 Branch: main (deployed)
📋 PR: #12 (merged)
📄 Release: https://github.com/{org}/{repo}/releases/tag/v1.0.0

🎉 Deployment complete!
```

---

## Requirements

- Run from development branch
- GitHub CLI (gh) required
- Development branch must be synced with main first
