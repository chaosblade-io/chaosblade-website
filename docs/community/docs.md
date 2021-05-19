---
title: Contribute documents
---

## Requirements

- GItHub ID: You'll need a GitHub account first
- fork repo
  - fork [chaosblade-website](https://github.com/chaosblade-io/chaosblade-website.git) repo，and `git remote add upstream https://github.com/chaosblade-io/chaosblade-website.git`
- [Node.js](https://nodejs.org/en/download/) version >= 12.13.0 or above (which can be checked by running `node -v`). You can use [nvm](https://github.com/nvm-sh/nvm) for managing multiple Node versions on a single machine installed
- [Yarn](https://yarnpkg.com/en/) version >= 1.5 (which can be checked by running `yarn --version`). Yarn is a performant package manager for JavaScript and replaces the `npm` client. It is not strictly necessary but highly encouraged.

## Clone Website Project

Clone project:

```shell
git clone https://github.com/<your-fork-repo>/chaosblade-website.git
```

## Local Development

Installing dependencies.

```shell
cd chaosblade-website
yarn install
yarn install v1.22.10
warning ../../package.json: No license field
[1/4] 🔍  Resolving packages...
[2/4] 🚚  Fetching packages...
[3/4] 🔗  Linking dependencies...
warning "@docusaurus/preset-classic > @docusaurus/theme-search-algolia > @docsearch/react@3.0.0-alpha.36" has unmet peer dependency "@types/react@>= 16.8.0 < 18.0.0".
warning "@docusaurus/preset-classic > @docusaurus/theme-search-algolia > @docsearch/react > @algolia/autocomplete-preset-algolia@1.0.0-alpha.44" has unmet peer dependency "@algolia/client-search@^4.5.1".
[4/4] 🔨  Building fresh packages...
✨  Done in 11.02s.
```

## Preview

```shell
yarn start
yarn run v1.22.10
warning ../../package.json: No license field
$ docusaurus start
Starting the development server...
Docusaurus website is running at: http://localhost:3000/

✔ Client
  Compiled successfully in 7.54s

ℹ ｢wds｣: Project is running at http://localhost:3000/
ℹ ｢wds｣: webpack output is served from /
ℹ ｢wds｣: Content not from webpack is served from /Users/saybot/own/chaosblade-website
ℹ ｢wds｣: 404s will fallback to /index.html
```

## Create a doc

Create a markdown file, `xxx.md`, and place it under the `docs` directory.

```shell
chaosblade-website # root directory of chaosblade-website
├── docs
│   └── xxx.md
├── src
│   └── pages
├── docusaurus.config.js
├── ...
```

At the top of the file, specify `id` and `title` in the front matter, so that Docusaurus will pick them up correctly when generating your site.

```md
---
id: greeting
title: Hello
---

## Hello from Docusaurus

Are you ready to create the documentation site for your open source project?

### Headers

will show up on the table of contents on the upper right

So that your users will know what this page is all about without scrolling down or even without reading too much.

### Only h2 and h3 will be in the toc

The headers are well-spaced so that the hierarchy is clear.

- lists will help you
- present the key points
- that you want your users to remember
  - and you may nest them
    - multiple times

### Custom id headers {#custom-id}

With `{#custom-id}` syntax you can set your own header id.
```

Once you save the file, the development server will automatically reload the changes. Now open `http://localhost:3000/docs/xxx`, you will see the new page you just created.


## Pull Request

Once the document is updated, it is ready for PR submission.