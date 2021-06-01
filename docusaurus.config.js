const path = require('path')

const organizationName = 'chaosblade-io' // Usually your GitHub org/user name.
const projectName = 'chaosblade-website' // Usually your repo name.
const branch = 'master'
const repoUrl = `https://github.com/${organizationName}/${projectName}`

module.exports = {
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
        defaultLocale: 'en',
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
    themeConfig: {
        image: 'img/cb-logo.png',
        metadatas: [{ name: 'twitter:card', content: 'summary' }],
        colorMode: {
            defaultMode: 'light',
            disableSwitch: false,
            respectPrefersColorScheme: true,
            switchConfig: {
                darkIcon: '🌜',
                lightIcon: '☀️',
                // React inline style object
                // see https://reactjs.org/docs/dom-elements.html#style
                darkIconStyle: {
                    marginLeft: '2px',
                },
                lightIconStyle: {
                    marginLeft: '1px',
                },
            },
        },
        prism: {
            theme: require('prism-react-renderer/themes/github'),
            darkTheme: require('prism-react-renderer/themes/dracula')
        },
        algolia: {
            apiKey: 'a408c7b1a069a17addfdfeffb900aceb',
            indexName: 'chaosblade',
        },
        gtag: {
            trackingID: 'G-FY5W27B8XH',
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
            items: [{
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
                    label: 'Getting Started',
                    to: '/docs',
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
                    href: 'https://seleniumhq.slack.com/join/shared_invite/zt-f7jwg1n7-RVw4v4sMA7Zjufira_~EVw#/'
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
    },
    presets: [
        [
            '@docusaurus/preset-classic', {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    editUrl: `${repoUrl}/edit/${branch}/website/`,
                    remarkPlugins: [
                        [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
                    ],
                },
                blog: {
                    showReadingTime: true,
                    postsPerPage: 3,
                    // Please change this to your repo.
                    editUrl: `${repoUrl}/edit/${branch}/website/blog/`,
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
                pages: {
                    remarkPlugins: [require('@docusaurus/remark-plugin-npm2yarn')],
                },
            },
        ],
    ],
    plugins: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: function ({
                        locale,
                        docPath,
                    }) {
                        return repoUrl + `/edit/master/docs/${locale}/${docPath}`;
                    },
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
                    includeCurrentVersion: true,
                },
                blog: {
                    showReadingTime: true,
                    editUrl:
                        'https://github.com/oam-dev/kubevela.io/tree/main/blog',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
        [
            '@docusaurus/plugin-client-redirects',
            {
                fromExtensions: ['html'],
            }
        ],
    ],
    themes: ['@saucelabs/theme-github-codeblock'],
    stylesheets: [
        'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600&display=block',
        'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&display=block'
    ],
    scripts: [
        'https://buttons.github.io/buttons.js'
    ]
}
