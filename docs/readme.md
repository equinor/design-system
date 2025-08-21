# EDS Documentation Contribution Guide

Welcome! This guide explains how to contribute to the documentation in the `docs` folder.  
Our documentation is published using [Docusaurus](https://docusaurus.io/), so please follow these guidelines for consistency, quality, and ease of maintenance.

---

## 📁 Folder Structure

- Organize documentation by topic (e.g., `components`, `foundation`, `patterns`, etc.).
- Each component or topic should have its own subfolder with an `index.md` file.
- Use lowercase and hyphens for folder and file names (e.g., `text-field`, `side-sheet`).

## 📝 Writing Guidelines

- **Clarity & Simplicity:** Write clear, concise, and user-focused documentation.
- **Structure:** Use headings (`##`, `###`) to organize content. Start with a short summary, followed by usage, examples, and references.
- **Code Examples:** Use fenced code blocks (```) and specify the language (e.g., `tsx`, `js`, `css`).
- **Accessibility:** Document accessibility features and requirements for each component.
- **Assets:** Store images and other assets in an `assets/` folder located within the same documentation folder as the markdown files that reference them. For assets shared across multiple documents or topics, use a top-level `assets/` folder in the `docs` directory. Always reference images and assets using relative paths from the markdown file.
- **Images:** Reference images with relative paths from the markdown file to the appropriate `assets/` folder.
- **Links:** Use relative links for internal references and absolute URLs for external resources.

## 🛠️ Docusaurus Specifics

- Use frontmatter at the top of each Markdown file for sidebar and metadata configuration:

  ```markdown
  ---
  title: Button
  sidebar_position: 1
  ---
  ```

- Use Markdown for all documentation. Avoid HTML unless necessary.
- For code blocks, use triple backticks and specify the language.
- Use Docusaurus admonitions for notes, tips, and warnings:
  
  ```markdown
  :::tip
  This is a helpful tip!
  :::

  :::warning
  This is a warning!
  :::
  ```

## 🧑‍💻 Contribution Process

1. **Fork and clone** the repository.
2. **Create a new branch** for your changes.
3. **Add or update Markdown files** in the appropriate folder.
4. **Run Prettier** to format your Markdown:  

    ```sh
    pnpm prettier --write .
    ```

5. **Test locally** with Docusaurus to preview your changes.
6. **Submit a pull request** with a clear description of your changes.

## ✅ Best Practices

- **Consistency:** Follow existing structure and naming conventions.
- **Documentation for All Features:** Document all props, usage patterns, accessibility, and edge cases.
- **Review:** Proofread for grammar, spelling, and clarity.
- **Accessibility:** Ensure documentation is accessible to all users.

## 🏷️ Frontmatter Reference

Include frontmatter at the top of each file for sidebar ordering and metadata:

```markdown
---
title: Component Name
sidebar_position: 1
---
```

## 📚 Resources

- [Docusaurus Docs](https://docusaurus.io/docs)
- [Markdown Guide](https://www.markdownguide.org/)
- [EDS Design System](https://eds.equinor.com/)

---

Thank you for contributing to EDS
