# Commit Organization Prompt

## Required Aliases
The following aliases MUST be used - DO NOT use the full git commands:
```bash
alias gst="git status"        # DO NOT use 'git status'
alias ga="git add"           # DO NOT use 'git add'
alias gcsm="git commit -m"   # DO NOT use 'git commit -m'
```

## Steps

### 1. Check Current Changes
Run:
```bash
gst
```

### 2. Analyze Changed Files
Group the changed files into these categories:
- Styles/CSS changes
- Component changes
- Page changes
- Icon changes
- Configuration changes
- Type/Interface changes
- Test changes
- Documentation changes

### 3. Organize Commits
For each group of related changes:

```bash
# Add files for this group
ga path/to/files

# Create commit with conventional commit message
gcsm "<type>(<scope>): <short summary>

Breaking: (if applicable)
Refs: #issue (if applicable)"
```

Where:
- **type**: feat|fix|docs|style|refactor|test|chore
- **scope**: styles|components|pages|icons|config|types|etc
- **summary**: Brief description in present tense, no period

## 4. Commit Order Priority
1. Configuration/Setup changes
2. Type/Interface changes
3. Style system changes
4. Component changes
5. Page changes
6. Documentation changes

## Example Organization:
```bash
# 1. Style System
ga src/styles/*.css
gcsm "Refactor(styles): implement shared component system"

# 2. Components
ga src/components/*.tsx
gcsm "Refactor(components): update style implementation"

# 3. Pages
ga src/pages/*.tsx
gcsm "Refactor(pages): adapt to new style system"
```