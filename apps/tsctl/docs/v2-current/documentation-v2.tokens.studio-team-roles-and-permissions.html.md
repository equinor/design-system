<!-- source: https://documentation-v2.tokens.studio/team/roles-and-permissions.html -->

# Roles and Permissions [​](#roles-and-permissions)

Studio uses a role-based access control system with customizable role templates at both the workspace and project level.

## Workspace Roles [​](#workspace-roles)

Workspace roles control what a member can do across the entire workspace:

| Permission | Admin | Billing Manager | Member | Viewer |
| --- | --- | --- | --- | --- |
| Manage organization settings | ✅ | ❌ | ❌ | ❌ |
| Manage billing & subscription | ✅ | ✅ | ❌ | ❌ |
| Invite & manage members | ✅ | ✅ | ❌ | ❌ |
| Manage roles | ✅ | ✅ | ❌ | ❌ |
| Create projects | ✅ | ❌ | Configurable | ❌ |
| Edit projects & tokens | ✅ | ❌ | ✅ | ❌ |
| View projects & tokens | ✅ | ✅ (read-only) | ✅ | ✅ |
| Counts towards seat limit | ✅ | ❌ | ✅ | ❌ |

### Billing Manager [​](#billing-manager)

The **Billing Manager** role is designed for team members who need to manage billing, subscriptions, and team membership — without taking up an editor seat or having access to edit design tokens.

**What Billing Managers can do:**

-   View and manage billing, invoices, and subscription plans
-   Invite, remove, and manage organization members
-   Manage organization roles
-   Access workspace settings
-   View projects and tokens (read-only)

**What Billing Managers cannot do:**

-   Create or edit projects
-   Create or edit design tokens
-   Manage project-level settings or integrations

TIP

Billing Managers do not count against your editor seat limit, making this role ideal for finance or operations team members who need billing access without consuming a paid seat.

## Project Roles [​](#project-roles)

Project roles control what a member can do within a specific project:

| Permission | Owner | Editor | Viewer |
| --- | --- | --- | --- |
| Manage project settings | ✅ | ❌ | ❌ |
| Create/edit tokens | ✅ | ✅ | ❌ |
| Create branches | ✅ | ✅ | ❌ |
| Merge branches | ✅ | ✅ | ❌ |
| Create releases | ✅ | Configurable | ❌ |
| Approve reviews | ✅ | ✅ | ❌ |
| View tokens | ✅ | ✅ | ✅ |
| Manage integrations | ✅ | ❌ | ❌ |

## Base Permissions [​](#base-permissions)

Base permissions set a default access level for **all workspace members** on a project — without requiring individual invitations. This is useful when you want every team member to have at least read or edit access by default.

| Level | UI Label | What workspace members can do |
| --- | --- | --- |
| `none` | **Invite only** | Only explicitly invited members can access the project |
| `read` | **Read** | All workspace members can view the project and its tokens |
| `edit` | **Write** | All workspace members can view and edit the project |

### Setting Base Permissions [​](#setting-base-permissions)

1.  Go to **Project Settings**
2.  Find the **Base Permission** dropdown
3.  Choose **Invite only**, **Read**, or **Write**
4.  Save

Only project owners, project admins, and workspace admins can change base permissions.

### Workspace Defaults [​](#workspace-defaults)

Workspace admins can set a default base permission that applies automatically to all new projects:

1.  Go to **Workspace settings**
2.  Find the **Default Base Permission** dropdown
3.  Choose **Invite only**, **Read**, or **Write** (defaults to Write)
4.  Save

Individual projects can override the workspace default at any time.

### How Base Permissions Interact with Roles [​](#how-base-permissions-interact-with-roles)

Base permissions define a floor — explicit project memberships always take precedence. If a member has an individual project role assigned, that role applies instead of the base permission.

## Custom Role Templates [​](#custom-role-templates)

Workspace admins can create custom role templates:

1.  Go to **Workspace settings → Roles**
2.  Click **Create Role**
3.  Name the role and configure permissions
4.  Assign the role to members

Custom roles inherit from a base template and can be tailored to your team's workflow.

## Assigning Roles [​](#assigning-roles)

### Workspace Level [​](#workspace-level)

1.  Go to **Workspace Members** in the sidebar
2.  Click on a member
3.  Change their workspace role
4.  Click **Save**

### Project Level [​](#project-level)

1.  Go to **Project Settings → Members**
2.  Add a member or click an existing one
3.  Assign a project role
4.  Click **Save**

![Members page showing team roles and permissions](/images/settings/project-members-light.png)![Members page showing team roles and permissions](/images/settings/project-members-dark.png)

## Next Steps [​](#next-steps)

-   [Workspaces](./organizations.html)
-   [Inviting members](./inviting-members.html)