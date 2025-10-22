# Search Prompts for TextField Multiline Migration

This document provides ready-to-use search commands to help identify TextField components with multiline prop in your codebase.

## Quick Start Commands

### Find All TextField with multiline

#### Using grep (most common)
```bash
# Basic search
grep -r "TextField" . | grep "multiline"

# With line numbers
grep -rn "TextField.*multiline" src/

# Case-insensitive
grep -rin "textfield.*multiline" src/

# Exclude node_modules and build directories
grep -r "TextField.*multiline" src/ --exclude-dir={node_modules,build,dist}

# Count occurrences
grep -rc "TextField.*multiline" src/ | grep -v ":0"
```

#### Using ripgrep (rg - faster alternative)
```bash
# Basic search
rg "TextField.*multiline" src/

# Show surrounding context (3 lines before and after)
rg "TextField.*multiline" -C 3 src/

# Only show file names
rg "TextField.*multiline" -l src/

# With file type filtering
rg "TextField.*multiline" -t tsx -t ts src/

# Count matches per file
rg "TextField.*multiline" --count src/
```

#### Using ag (The Silver Searcher)
```bash
# Basic search
ag "TextField.*multiline" src/

# With context
ag "TextField.*multiline" -C 3 src/

# Only file names
ag "TextField.*multiline" -l src/

# Ignore case
ag -i "textfield.*multiline" src/
```

#### Using find + grep combination
```bash
# Search in .tsx and .ts files only
find src/ -name "*.tsx" -o -name "*.ts" | xargs grep -l "TextField.*multiline"

# With line numbers
find src/ -name "*.tsx" -o -name "*.ts" | xargs grep -n "TextField.*multiline"
```

## Specific Pattern Searches

### Find TextField with explicit multiline={true}
```bash
# Using grep
grep -rn "TextField.*multiline={true}" src/

# Using rg
rg "TextField.*multiline=\{true\}" src/
```

### Find TextField with just multiline prop (boolean shorthand)
```bash
# Using grep - this is tricky with regex
grep -rn "<TextField[^>]*multiline[^=]" src/

# Using rg
rg "<TextField[^>]*multiline\s" src/
```

### Find TextField with conditional multiline
```bash
# Using grep
grep -rn "multiline={.*}" src/

# Using rg
rg "multiline=\{[^}]+\}" src/
```

### Find TextField with spread props (potential multiline)
```bash
# Using grep
grep -rn "TextField.*{\.\.\..*}" src/

# Using rg
rg "TextField.*\{\.\.\." src/
```

### Find textareaRef usage (needs to be changed to ref)
```bash
# Using grep
grep -rn "textareaRef" src/

# Using rg
rg "textareaRef" src/
```

## IDE-Specific Searches

### Visual Studio Code
1. Open Search (Cmd/Ctrl + Shift + F)
2. Enable regex mode (.*) 
3. Use pattern: `TextField.*multiline`
4. Filter by file type: `*.tsx, *.ts`

Search patterns:
```
TextField.*multiline
<TextField[^>]*multiline
textareaRef
```

### IntelliJ IDEA / WebStorm
1. Edit → Find → Find in Files (Cmd/Ctrl + Shift + F)
2. Enable regex
3. Use pattern: `TextField.*multiline`
4. Scope: Project Files
5. File mask: `*.tsx,*.ts`

### Sublime Text
1. Find → Find in Files (Cmd/Ctrl + Shift + F)
2. Enable regex (Alt + R)
3. Pattern: `TextField.*multiline`
4. Where: `*.tsx,*.ts`

### Atom
1. Find → Find in Project (Cmd/Ctrl + Shift + F)
2. Enable regex (Alt + Cmd/Ctrl + /)
3. Pattern: `TextField.*multiline`
4. File/directory pattern: `*.tsx,*.ts`

## Advanced Searches

### Find imports of TextField
```bash
# Using grep
grep -rn "import.*TextField" src/

# Using rg
rg "import.*TextField" src/

# Find all TextField imports with their paths
rg "import.*\{.*TextField.*\}" src/ -A 0
```

### Find files with both TextField and multiline
```bash
# Using grep (two-step)
grep -l "TextField" src/**/*.tsx | xargs grep -l "multiline"

# Using rg
rg -l "TextField" src/ | xargs rg -l "multiline"
```

### Find complex prop patterns
```bash
# Props with rowsMax (often used with multiline)
rg "TextField.*rowsMax" src/

# Props with rows (common with multiline)
rg "TextField.*rows" src/

# Multiple props that suggest multiline usage
rg "TextField.*(rows|rowsMax|textareaRef)" src/
```

### Count total instances
```bash
# Using grep
echo "Total files with TextField multiline:"
grep -rl "TextField.*multiline" src/ | wc -l

# Using rg
echo "Total matches:"
rg "TextField.*multiline" src/ --count-matches | awk -F: '{sum+=$2} END {print sum}'
```

## Git History Searches

### Find when multiline was last used
```bash
# Show commits that touched TextField multiline
git log -S "multiline" --source --all -- "*.tsx" "*.ts"

# Show actual changes
git log -p -S "multiline" -- "*.tsx" "*.ts"

# Find files in git history
git log --all --full-history -- "**/TextField*"
```

## Output Formatting

### Generate a report
```bash
# Create a file with all matches and their locations
rg "TextField.*multiline" src/ > textfield-migration-report.txt

# With context for easier review
rg "TextField.*multiline" -C 2 src/ > textfield-migration-report-context.txt

# CSV format for spreadsheet
rg "TextField.*multiline" src/ --json | jq -r '[.data.path.text, .data.line_number, .data.lines.text] | @csv' > report.csv
```

### Count by file
```bash
# Using rg
rg "TextField.*multiline" src/ --count | sort -t: -k2 -rn

# Show files with most occurrences first
rg "TextField.*multiline" src/ --count | sort -t: -k2 -rn | head -10
```

## Validation After Migration

### Verify no multiline props remain on TextField
```bash
# Should return no results after migration
rg "TextField.*multiline" src/

# Check for any remaining textareaRef
rg "textareaRef" src/
```

### Verify Textarea is imported where needed
```bash
# Find files with Textarea component
rg "<Textarea" src/ -l

# Check imports
rg "import.*Textarea" src/
```

### Find potential issues
```bash
# Find Textarea with incompatible props (should not exist)
rg "Textarea.*(inputIcon|unit|meta)" src/

# Find any remaining Field component usage (internal component)
rg "Field.*\$multiline" src/
```

## Integration with CI/CD

### Pre-commit hook
```bash
#!/bin/bash
# .git/hooks/pre-commit

if git diff --cached --name-only | grep -q "\.tsx\?$"; then
  if git diff --cached | grep -q "TextField.*multiline"; then
    echo "Error: TextField with multiline prop found"
    echo "Please use Textarea component instead"
    echo "See MIGRATION_TEXTFIELD_MULTILINE.md for details"
    exit 1
  fi
fi
```

### GitHub Actions check
```yaml
# .github/workflows/check-textfield-multiline.yml
name: Check TextField Multiline
on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check for TextField multiline
        run: |
          if grep -r "TextField.*multiline" src/; then
            echo "Error: Found TextField with multiline prop"
            echo "Please use Textarea component instead"
            exit 1
          fi
```

## Tips

1. **Start with file list**: Use `-l` flag to get a list of files first, then examine them one by one
2. **Use context**: `-C 3` or similar to see surrounding code
3. **Combine tools**: Use grep/rg to find, then open in your IDE for refactoring
4. **Save results**: Redirect output to a file for tracking progress
5. **Incremental migration**: Focus on one directory or feature at a time
6. **Test thoroughly**: After each batch of migrations, run tests before continuing

## Common Pitfalls

When searching, watch out for:

- Comments containing "TextField" and "multiline" (false positives)
- Multiline as a variable name (not the prop)
- String literals containing the search pattern
- Minified or bundled code

Exclude these with:
```bash
rg "TextField.*multiline" src/ \
  --type-not minified \
  --glob '!*.min.js' \
  --glob '!build/' \
  --glob '!dist/'
```
