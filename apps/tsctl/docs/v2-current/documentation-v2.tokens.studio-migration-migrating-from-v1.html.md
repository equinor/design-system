<!-- source: https://documentation-v2.tokens.studio/migration/migrating-from-v1.html -->

# Migrating from Studio v1 [​](#migrating-from-studio-v1)

A step-by-step guide to get your team onto the new Tokens Studio Platform (v2).

-   **Time needed:** ~15 minutes
-   **Difficulty:** Easy

## Before You Start [​](#before-you-start)

Welcome! This guide walks you through migrating from the Tokens Studio plugin (v1) to the new Tokens Studio Platform (v2). The process is straightforward and your existing tokens stay safe throughout.

**What you'll need:**

-   Access to your current Tokens Studio plugin or your exported token JSON files
-   An email address for your new v2 account
-   About 15 minutes

**What happens during migration:**

-   You create a new account on the v2 platform
-   You export your tokens from v1 and import them into v2
-   You share your new account details with us so we can activate your subscription
-   You share any import errors so we can help resolve them
-   Your old platform stays active during the transition, so there's zero downtime

TIP

Your existing subscription will be linked to your new account at no extra cost. You won't be charged twice during the migration period.

## Step 1: Create Your v2 Account [​](#step-1-create-your-v2-account)

Go to [production.tokens.studio/register](https://production.tokens.studio/register) and create a new account with your work email.

You'll get a **14-day free trial** with full access to every feature. That gives you plenty of time to explore v2 and validate your migration before we link your subscription.

During signup:

1.  Enter your work email and create a password
2.  Verify your email address
3.  Follow the prompts to create your **Workspace**
4.  Create your **Project** and choose a project type — **token-based** is recommended if you're migrating existing tokens
5.  Click **Start 14-day trial**. (At the end of this guide, you'll share your details with us so we can activate the subscription on your account.)
6.  You'll land on your new workspace dashboard

TIP

If you need to invite team members, head to **Workspace settings**. For details, see [Inviting members](./../team/inviting-members.html).

## Step 2: Export Your Tokens from v1 [​](#step-2-export-your-tokens-from-v1)

Grab your existing tokens from the **Tokens** overview of your project at [app.prod.tokens.studio](https://app.prod.tokens.studio/).

Important

Make sure you download the complete token file with all your sets and themes. If you have multiple JSON files, you can import them one at a time.

## Step 3: Import Your Tokens into v2 [​](#step-3-import-your-tokens-into-v2)

This is the core of the migration. Head to your new v2 project and import your tokens.

1.  Open your project in v2 and go to the **Tokens** page
2.  Click **Import**
3.  Select or drag in your JSON token file or Zip file
4.  Wait for validation to complete
5.  Review the results

Save your import errors

Before you leave the import page, **copy or screenshot any errors and warnings** shown in the results. You'll share them with us in [Step 4](#step-4-share-your-details-with-us) so we can help resolve them. Once you navigate away, the import summary is no longer available.

### Understanding Import Results [​](#understanding-import-results)

The v2 platform is stricter about token types and formatting than v1, so you may see warnings or errors after import. This is completely normal and expected.

Common warnings you might see:

| Warning | What it means | What to do |
| --- | --- | --- |
| **Missing dimension units** | A spacing or sizing token has a value like `16` without `px` or `rem` | Can be fixed later in bulk with search & replace |
| **Shadow format errors** | Shadow tokens don't match the expected structure (x, y, blur, spread, color) | Share with us — we'll help fix the format |
| **Unresolved references** | A token references another token that wasn't found | Often caused by spaces in names or slight mismatches |
| **Type mismatches** | A token's value doesn't match its declared type | Usually a v1 legacy issue; we'll help resolve |

TIP

Don't worry about fixing errors right away. Your tokens are safely imported regardless of warnings, and we'll help you work through anything that needs attention.

## Step 4: Share Your Details With Us [​](#step-4-share-your-details-with-us)

Action required

This step is important. We need to hear from you so we can activate your subscription and help with any import issues.

Once you've completed the import, please send us the following:

| What to share | Details |
| --- | --- |
| **Your v2 account email** | The email address you used to register on the new platform |
| **Your workspace name** | The name of your workspace as shown in the platform |
| **Import error screenshot or summary** | A copy of any errors shown on the import page |
| **Any questions or concerns** | Anything that looked unexpected or that you'd like help with |

**How to reach us:**

-   **Slack:** Message us in your private Tokens Studio Slack channel. If you don't have one yet, let us know and we'll set one up for you.
-   **Email:** Send the details to [support@tokens.studio](mailto:support@tokens.studio), or reply to the email you received from us.

## Step 5: Explore Your New Platform [​](#step-5-explore-your-new-platform)

While you wait for us to activate your subscription, take some time to explore. A few things worth trying:

| Feature | What to try |
| --- | --- |
| **Token browser** | Click through your imported sets and confirm your values and references look correct |
| **Theming** | Check that your themes (light/dark, brands) imported correctly by switching modes |
| **Dependencies** | Open any token and use the dependencies view to see what references it |
| **Issues filter** | Use **Show Issues Only** to find tokens that need attention |
| **Search & replace** | Rename a token and watch all references update automatically |
| **Branching** | Create a test branch to experiment without affecting your main tokens |
| **History** | Open a token to see its full change history |

## What Happens Next [​](#what-happens-next)

After you share your account details with us:

1.  **We activate your subscription** on v2 and link it to your existing plan — no extra charges, no interruption.
2.  **We review your import errors** and either fix them for you or send clear instructions on how to resolve them.
3.  **You validate at your own pace.** Your old platform stays active during the transition, so you can switch over when you're confident everything works.

## Frequently Asked Questions [​](#frequently-asked-questions)

### Will I lose any tokens during migration? [​](#will-i-lose-any-tokens-during-migration)

No. All your tokens are exported from v1 and imported into v2. Even tokens with import warnings are safely stored. You can fix issues after import without losing any data.

### Do I need to cancel my old subscription? [​](#do-i-need-to-cancel-my-old-subscription)

No. We handle the subscription transition for you. Your existing plan gets linked to your new account, so you won't be double-charged.

### How many import errors are normal? [​](#how-many-import-errors-are-normal)

It varies. Some teams see zero errors, others see 100+. It depends on the age and complexity of your token set. Even high error counts are fixable and don't mean anything is wrong with your tokens.

### Can my team keep working on v1 during migration? [​](#can-my-team-keep-working-on-v1-during-migration)

Yes. The old platform stays fully active. Take as much time as you need to validate v2 before switching over.

### What's new in v2? [​](#what-s-new-in-v2)

A lot — the highlights: real-time multiplayer editing, full branching and version control, a much faster token engine, advanced color functions and math support, direct CSS/JSON exports (no more Style Dictionary required), a new CLI, CI/CD pipeline integration, and a Figma Companion plugin.

### What if I run into problems? [​](#what-if-i-run-into-problems)

Reach out on Slack or email [support@tokens.studio](mailto:support@tokens.studio). We're here to help and typically respond within a few hours.

## Migration Checklist [​](#migration-checklist)

Use this checklist to track your progress:

-   \[ \] Create your account at [production.tokens.studio/register](https://production.tokens.studio/register)
-   \[ \] Create a new project in your workspace
-   \[ \] Export your tokens from the old platform (JSON file)
-   \[ \] Import tokens into your v2 project
-   \[ \] Review import results and note any errors
-   \[ \] Send us your account email, workspace name, and import results
-   \[ \] Explore the new platform features
-   \[ \] Wait for subscription activation confirmation
-   \[ \] Schedule or attend your setup call
-   \[ \] Validate your tokens, themes, and references
-   \[ \] Connect the Figma Companion plugin (optional)
-   \[ \] Set up CI/CD pipeline integration (optional)
-   \[ \] Confirm everything works and switch over

## Need Help? [​](#need-help)

Questions? We're here to help.

-   **Slack:** your private Tokens Studio channel
-   **Email:** [support@tokens.studio](mailto:support@tokens.studio)

## Next Steps [​](#next-steps)

-   [Quick Start guide](./../getting-started/quick-start.html)
-   [What is Studio?](./../getting-started/what-is-studio.html)
-   [Inviting team members](./../team/inviting-members.html)