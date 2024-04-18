# Issue Tracking

We use GitHub Issues for tracking feature requests and bugs.

You can view existing issues [here](https://github.com/javianng/twenity/issues) or at the command line using the [GitHub CLI](https://cli.github.com/):

```
gh issue list
gh issue view <issue-number>  // issue number starts with #
```

## Bug Reports

Bug report titles should start with the prefix `bug:`, followed by a short description of the bug.
Steps to reproduce the bug should be included in the body of the issue.

Unconfirmed bugs get the `C-bug?` category label. Once confirmed but without a priority assigned,
they get the `C-bug` and `S-triage` labels.

They can be assigned a priority label `P-critical`, `P-high`, `P-medium`, or `P-low` depending on the severity of the bug.

## Feature Requests

Feature request titles should start with the prefix `feat:`, followed by a short description of the feature.
The body of the issue should include a description of the feature and how it should work.

Features can be classified as `C-enhancement` or `C-feature` depending on whether they are a new feature or an enhancement to an existing feature.

Like bugs, features get a non-critical `P-` label and can be further tagged with an `F-` label to indicate the overarching feature (e.g. CMS, website, algorithm) they belong to.

## Contributing

We also have `Z-` labels for the expected difficulty of the issue. `Z-easy` issues are good for first-time contributors.

You may assign any issue to yourself using the `Assignees` field on the right side of the issue page, or at the command line:

```
gh issue edit <issue-number> --assignee @me
```

<Callout type="warning" emoji="⚠️">
    **Do not assign yourself to `Z-hard` issues without discussing with the core team first.** `Z-hard` issues involve
    making architectural decisions or implementing complex features.
</Callout>

<Callout type="warning" emoji="⚠️">
    **Do not start working on issues before they are assigned to you.** We want to avoid duplicate work.
</Callout>
