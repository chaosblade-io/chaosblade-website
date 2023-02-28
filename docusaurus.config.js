// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const path = require('path')

const organizationName = 'chaosblade-io' // Usually your GitHub org/user name.
const projectName = 'chaosblade-website' // Usually your repo name.
const branch = 'master'
const repoUrl = `https://github.com/${organizationName}/${projectName}`
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'ChaosBlade',
    tagline: 'Help companies solve the high availability problems in the process of migrating to cloud-native systems through chaos engineering',
    url: 'https://chaosblade.io',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'throw',
    favicon: 'img/favicon/favicon.ico',
    organizationName,
    projectName,
    customFields: {
        repoUrl
    },
    i18n: {
        defaultLocale: 'zh',
        locales: ['en', 'zh'],
        localeConfigs: {
            en: {
                label: 'English',
            },
            zh: {
                label: '简体中文',
            },
        },
    },
    themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
        image: 'img/cb-logo.png',
        metadata: [{ name: 'twitter:card', content: 'summary' }],
        docs: {
            sidebar: {
              autoCollapseCategories: true,
            },
        },
        colorMode: {
            defaultMode: 'light',
            disableSwitch: false,
            respectPrefersColorScheme: true,
        },
        prism: {
            theme: lightCodeTheme,
            darkTheme: darkCodeTheme,
            additionalLanguages: ['java','go'],
        },
        algolia: {
            appId: 'AJZLJ48ZRO',
            apiKey: '778c20275bbb7d909cf22e4663360e39',
            indexName: 'chaosblade',
        },
        announcementBar: {
            id: 'supportus',
            content:
                `⭐️  &nbsp; If you like ChaosBlade, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/${organizationName}/chaosblade">GitHub</a>! ⭐️`,
        },
        navbar: {
            title: 'ChaosBlade',
            logo: {
                alt: 'ChaosBlade',
                src: 'img/cb-head.png',
                srcDark: 'img/cb-head.png',
            },
            items: [
            { type: 'docsVersionDropdown' },
            {
                label: 'Documentation',
                position: 'left',
                activeBasePath: 'docs',
                to: 'docs',
            },
            {
                to: 'blog',
                label: 'Blog',
                position: 'left'
            },
            {
                href: 'https://github.com/chaosblade-io/chaosblade',
                className: 'header-githab-link',
                position: 'right',
            },
            {
                type: 'localeDropdown',
                position: 'right',
            },
            ],
        },
        footer: {
            style: 'dark',
            links: [{
                title: 'Docs',
                items: [{
                    label: 'About ChaosBlade',
                    to: '/docs',
                },{
                    label: 'Contribute documents',
                    to: '/docs/community',
                }],
            }, {
                title: 'Community',
                items: [{
                    label: 'Gitter',
                    href: `https://gitter.im/chaosblade-io/community`,
                }, {
                    label: 'Twitter',
                    href: `https://twitter.com/chaosblade.io`,
                }, {
                    label: 'Slack',
                    href: 'https://join.slack.com/t/chaosblade-io/shared_invite/zt-f0d3r3f4-TDK13Wr3QRUrAhems28p1w'
                }, {
                    label: 'DingTalk(23177705)',
                    href: '/',
                }],
            }, {
                title: 'More',
                items: [{
                    html:
                        '<a href="https://www.netlify.com"><img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by Netlify" /></a>',
                }],
            },
            ],
            logo: {
                alt: 'CNCF',
                src: '/img/cncf-white.svg',
                href: 'https://cncf.io/'
            },
            copyright: `© ${new Date().getFullYear()} The ChaosBlade Authors. All rights reserved. <br />
            The Linux Foundation has registered trademarks and uses trademarks.
            For a list of trademarks of The Linux Foundation,
            please see our <a href="https://www.linuxfoundation.org/trademark-usage/"> Trademark Usage</a> page.`,
        },
    }),

    presets: [
        [
          'classic',
          /** @type {import('@docusaurus/preset-classic').Options} */
          ({
            docs: {
                sidebarPath: require.resolve('./sidebars.js'),
                // Please change this to your repo.
                editUrl: `${repoUrl}/edit/${branch}/`,
                remarkPlugins: [
                    [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
                ],
            },
            blog: {
                blogSidebarTitle: '全部博文',
                blogSidebarCount: 'ALL',
                showReadingTime: true,
                // postsPerPage: 3,
                postsPerPage: 'ALL',
                // Please change this to your repo.
                editUrl: `${repoUrl}/edit/${branch}/`,
                authorsMapPath: 'authors.yml',
            },
            theme: {
                customCss: require.resolve('./src/css/custom.css'),
            },
            pages: {
                remarkPlugins: [require('@docusaurus/remark-plugin-npm2yarn')],
            },
            gtag: {
                trackingID: 'G-FY5W27B8XH',
                anonymizeIP: true,
            },
          }),
        ],
    ],

    stylesheets: [
        'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600&display=block',
        'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&display=block'
    ],
    scripts: [
        'https://buttons.github.io/buttons.js'
    ],
};

module.exports = config;
