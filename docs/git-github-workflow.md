import { Callout } from "nextra-theme-docs";

# Git & GitHub Workflow

This page discusses the workflow we use to manage collaboration on the project using [Git](https://git-scm.com/downloads)
and [GitHub](https://github.com).

This page will assume that you have little to no experience with Git and GitHub. If you are already familiar with Git and GitHub,
you can skip directly to the [Workflow](#workflow) section.

## Git

[Git](https://git-scm.com/downloads) is a version control system that allows us to track changes to files and collaborate with other developers.
It is a distributed version control system, which means that each developer has a full copy of the repository on their local machine.

Git revolves primarily around the concepts of [branching](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell) and
[commits](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)

If this is your first time using Git, you will need to configure your name and email address.
You can do this using the `git config` command:

```
git config --global user.name "<name>"
git config --global user.email "<email>"
```

### Branching

To create a new branch, you can use the `git checkout` command:

```
git checkout -b <branch-name>
```

If a branch with the given name already exists, the command will fail.
To switch to an existing branch, you can use the `git checkout` command without the `-b` flag:

```
git checkout <branch-name>
```

Whenever you create a branch, note that the branch will be created from the current state of the branch you were on when you ran the `git checkout` command.

### Committing

Whenever you complete some amount of work that you want to save, you can create a commit.

A commit is a snapshot of the current state of the repository. It contains information about the files that have changed, and the changes that have been made to those files.

Before you begin a commit, you need to select the files you wish to commit via a process known as staging.
You can stage files using the `git add` command:

```
git add <file-name>
```

Once you have staged the files you wish to commit, you can create the commit using the `git commit` command:

```
git commit -m "<commit-message>"
```

We will discuss the conventions for commit messages in the page on [Conventions](conventions.md).

## GitHub

[GitHub](https://github.com) is a web-based Git repository hosting service. It provides all of the same functionality as Git, but adds
additional features such as issue tracking, pull requests, and code reviews.

It is conventional to refer to the remote repository on GitHub as the "upstream" repository.
Branches can be _pushed_ to the upstream repository, and _pulled_ from the upstream repository.

### Pushing

Once you have committed your changes, you can push them to the upstream repository using the `git push` command:

```
git push -u origin <branch-name>
```

The `-u` flag tells Git to remember the upstream repository and branch for the current branch.

### Pulling

Whenever you want to update your local repository with the latest changes from the upstream repository, you can pull the changes using the `git pull` command:

```
git pull
```

You may also want to update your list of branches from the upstream repository. You can do this using the `git fetch` command:

```
git fetch
```

The commands we have discussed so far are just the basic commands that are sufficient to get you started with Git.
For more information about Git, refer to the [Git Book](https://git-scm.com/book/en/v2) as well as the [Git Reference](https://git-scm.com/docs).

## Workflow

<Callout type="warning" emoji="⚠️">
    **All developers must follow the workflow as described in this section.**
</Callout>

Our workflow is loosely based off of the [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).

- The `main` branch is the branch that is deployed to production and visible to the public at [twenity](https://twenity.vercel.app/).

- The `dev` branch is the development branch of the repository. This is the branch that is deployed to the staging environment at `.vercel.app/`.

- Feature branches are used to develop new features. These branches are branched off of most recent commit on the `dev` branch.

To create a new feature branch, you can use the `git checkout` command:

```
git checkout dev
git pull
git checkout -b <branch-name>
```

### Pull Requests

Whenever your feature/bugfix/whatever on your feature branch is ready to be merged into the `dev` branch, you can push the branch
to the upstream repository and open a pull request.

```
git push -u origin <branch-name>
gh pr create  // you should have the GitHub CLI installed
```

Follow the prompts at the interactive terminal to create the pull request.
You will be asked to provide a title, an optional description, and finally any other metadata you wish to add before the pull request is created.

For the conventions for the title and description, refer to the page on [Conventions](conventions.md).

<Callout type="error" emoji="️🚫">
    **Pushing directly to the `main` or `dev` branches is prohibited. Always use pull requests to merge changes.**
</Callout>

### Merge Conflicts

Whenever you push your changes to the upstream repository, you may encounter a merge conflict, letting you know that your
changes cannot be automatically merged into the target branch (typically `dev`).

This means that the changes you made to the files in your branch conflict with the changes that have been made to the same files
by other developers (or perhaps even you) in the target branch.

Typically, Git is able to automatically resolve merge conflicts across different files, but typically changes within
the same file cannot be automatically resolved.

<Callout type="info" emoji="ℹ️">
    It is best practice to pull the latest changes from the upstream repository and merge the conflicts locally before
    you push your changes.
</Callout>

You can perform this merge locally using the `git merge` command:

```
git checkout dev            // switch to the dev branch
git pull                    // pull the latest changes from the upstream repository
git checkout <branch-name>  // switch back to your feature branch
git merge dev               // merge the dev branch into your feature branch
```

If there are merge conflicts, you will be prompted to resolve them. You can do this by editing the files that have merge conflicts,
and then committing the changes.

If you are using WebStorm, you can use the built-in merge conflict resolution tool to resolve the conflicts.

<Callout type="warning" emoji="⚠️">
    When using merge tools, you may be prompted to "accept incoming/theirs" or "accept yours" when it comes to changes.

    These options should typically be avoided unless you are absolutely sure that you want to ignore person's changes.
    Instead, you should manually resolve the conflicts by editing the files in a 3-way merge.

</Callout>

### Code Reviews

Before your pull request can be merged into the `dev` branch, it must be approved by at least one developer from the core team.

You can request a code review by selecting any of the core team members as a reviewer on the pull request.

<Callout type="info" emoji="ℹ️">
    Before requesting a code review, you should ensure that:

    - The pull request title and description follow the conventions described in the page on [Conventions](conventions.md).
    - The pull request is up-to-date with the latest changes from the `dev` branch and do not contain merge conflicts.
    - Your code compiles without errors (including TypeScript errors!) and ESLint warnings.
    - Your code has been properly formatted using Prettier.

</Callout>

If you are unsure about any warnings or errors that you are seeing in your code, feel free to leave a comment on the
pull request asking for clarification.

#### Changes Requested

Code reviews are meant to catch logical errors in the code, ensure that implementations meet requirements, and follows
the style guidelines, all before reaching production.

If you are requested to make changes to your pull request, you should make the changes locally on the same feature branch,
push them to the upstream repository, then re-request a review.

Remember to pull the latest changes from the upstream repository before you push your changes.

#### Approved

If your pull request is approved, you can merge it into the `dev` branch. You can do this by clicking "Merge pull request" on GitHub,
though it is likely that the reviewer will do so for you after approving the pull request.
