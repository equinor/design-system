# 🔄 How to Rebase Your Feature Branch onto `origin/develop`

Keeping your feature branch up to date with the latest `develop` branch helps:

- ✅ Avoid merge conflicts
- ✅ Maintain a clean, readable Git history
- ✅ Ensure your pull request is easy to review and merge

This guide walks you through the correct way to rebase using Git, step by step.

---

## 📋 Prerequisites

- You are working in a local feature branch (e.g. `my-feature`)
- The upstream integration branch is `origin/develop`
- You have committed all your local changes

---

## ✅ Step-by-Step Rebase Instructions

### 1. Fetch the latest changes from the remote

Make sure your local repository has the latest info from the remote:

```bash
git fetch origin
```

---

### 2. Switch to your feature branch

Make sure you’re on the branch you want to update:

```bash
git checkout my-feature
```

---

### 3. Rebase your branch onto `origin/develop`

This reapplies your local commits on top of the updated `origin/develop`:

```bash
git rebase origin/develop
```

---

### 4. Resolve any conflicts (if they occur)

If conflicts arise during the rebase:

– Open the conflicted files
– Resolve them manually
– Then mark them as resolved:

```bash
git add <filename>
```

Or, to stage all changes:

```bash
git add .
```

Then continue the rebase process:

```bash
git rebase --continue
```

To abort the rebase entirely (if needed):

```bash
git rebase --abort
```

---

### 5. Test your branch after rebasing

Run your tests or build process to ensure everything works correctly after the rebase.

---

### 6. Push the updated branch to your remote

After rebasing, your branch history has changed. Push it with:

```bash
git push --force-with-lease
```

> ✅ Use `--force-with-lease` instead of `--force` to prevent accidentally overwriting others’ work.

---

## 🧪 TL;DR — Quick Copy-Paste Guide

```bash
git fetch origin
```

```bash
git checkout my-feature
```

```bash
git rebase origin/develop
```

```bash
git add .
git rebase --continue
```

```bash
git push --force-with-lease
```

---

Keep your branch clean. Rebase regularly. Make pull requests easy to review. 🚀

## ⚖️ Rebase vs Merge

| Feature                    | Rebase           | Merge                            |
| -------------------------- | ---------------- | -------------------------------- |
| Clean, linear history      | ✅ Yes           | ❌ No                            |
| Keeps commit tree tidy     | ✅ Yes           | ❌ No                            |
| Ideal for feature branches | ✅ Yes           | ⚠️ Only if no rebase is possible |
| Safe for shared branches   | ❌ Use with care | ✅ Yes                           |

---
