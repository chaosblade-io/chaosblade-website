# Contributing Guide

This document explains the process of contributing to the Chaosblade project.

First of all please follow the [CODE_OF_CONDUCT](https://github.com/chaosblade-io/chaosblade/blob/master/CODE_OF_CONDUCT.md) in all your interactions within the project.

## Create a branch

1. `git checkout main` from any folder in your local `chaosblade-website` repository.
1. `git pull origin main` to ensure you have the latest main code.
1. `git checkout -b the-name-of-my-branch` to create a branch.
   > replace `the-name-of-my-branch` with a suitable name, such as `update-animations-page`

## Make the change

1. Follow the "[Running locally](README#running-locally)" instructions.
1. Save the files and check in the browser.
1. Some changes may require a server restart to generate new files. (Pages in `docs` always do!)
1. Edits to pages in `docs` will only be visible in the latest version of the documentation, called "Next", located under the `docs/next` path.

Visit **http://localhost:3000/docs/next/YOUR-DOCS-PAGE** to see your work.

## Test the change

If possible, test any visual changes in all latest versions of the following browsers:

- Chrome and Firefox on the desktop.
- Chrome and Safari on mobile.

## Push it

1. `git add -A && git commit -m "My message"` to stage and commit your changes.
   > replace `My message` with a commit message, such as `Fixed header logo on Android`
1. `git push my-fork-name the-name-of-my-branch`
1. Go to the [chaosblade-website repo](https://github.com/chaosblade-io/chaosblade-website) and you should see recently pushed branches.
1. Follow GitHub's instructions.
1. Describe briefly your changes (in case of visual changes, please include screenshots).
