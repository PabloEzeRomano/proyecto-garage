# Commit Organization Prompt

## 1. Check Current Changes
Run:
```bash
gst
```

## 2. Analyze Changed Files
Group the changed files into these categories:
- Styles/CSS changes
- Component changes
- Page changes
- Icon changes
- Configuration changes
- Type/Interface changes
- Test changes
- Documentation changes

## 3. Organize Commits
For each group of related changes, create a commit using this format:

```bash
# Add files for this group
ga path/to/files

# Create commit with conventional commit message
gcsm "<type>(<scope>): <short summary>

- Change 1
- Change 2
- Change 3

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
gcsm "refactor(styles): implement shared component system

- Create base component styles
- Remove duplicate classes
- Implement style inheritance
- Add theme compatibility"

# 2. Components
ga src/components/*.tsx
gcsm "refactor(components): update style implementation

- Update class names
- Implement new style system
- Improve component consistency"

# 3. Pages
ga src/pages/*.tsx
gcsm "refactor(pages): adapt to new style system

- Update style imports
- Implement shared components
- Fix class naming"
```