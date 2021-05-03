import React from 'react'
import clsx from 'clsx'
import Layout from '@theme/Layout'
// import CodeBlock from '@theme/CodeBlock'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'

import LogoCarousel from './components/LogoCarousel'
import Feature from './components/Feature'
import Section from './components/Section'
import Highlight from './components/Highlight'

import styles from './styles.module.css'
import { logos, features, LHIntregrationExample, SetupExample, ReactIntegration } from '../data'



function Home() {
    const context = useDocusaurusContext()
    const { siteConfig = {} } = context
    return (
        <Layout
            title={`${siteConfig.title} · ${siteConfig.tagline}`}
            description={`${siteConfig.tagline}`}>
            <header className={clsx('hero hero--primary', styles.heroBanner)}>
                <div className="container">
                    <h1 className="hero__title">
                        {/* <Robot /> */}
                        <img className={styles.homeImg} src="/img/homepage-img.png" alt="homepage" />
                    </h1>
                    <p className="hero__subtitle">{siteConfig.tagline}</p>
                    <div className={styles.social}>
                        <iframe src="https://ghbtns.com/github-btn.html?user=chaosblade-io&amp;repo=chaosblade&amp;type=watch&amp;count=true" height="20" width="118" frameBorder="0" scrolling="0" style={{ width: '118px', height: '20px' }}></iframe>
                    </div>
                    <div className={styles.buttons}>
                        <Link
                            className={clsx(
                                'button button--outline button--secondary button--lg',
                                styles.getStarted,
                            )}
                            to={useBaseUrl('/docs/')}>
                        Get Started
                        </Link>
                        <Link
                            to="https://github.com/chaosblade-io/chaosblade"
                            className={clsx(
                                'button button--outline button--secondary button--lg',
                                styles.getStarted,
                            )}
                        >Learn More</Link>
                    </div>
                </div>
            </header>
            <main>
            <Highlight
                    img={
                        <img
                            width="560"
                            height="315"
                            src="/img/what-is-chaosblade.jpg"
                        />
                    }
                    isDark
                    title="What is ChaosBlade"
                    text={
                        <>
                            <p>
                                ChaosBlade is a cloud-native chaos engineering platform that supports multiple environments, clusters, and languages.
                            </p>
                            <p>
                                It includes the chaosblade-box chaos engineering platform and the chaosblade chaos engineering tool.
                            </p>
                        </>
                    }
                />
                {features && features.length > 0 && (
                    <Section>
                        {features.map((props, idx) => (
                            <Feature key={idx} {...props} />
                        ))}
                    </Section>
                )}
                <Section isDark>
                    <LogoCarousel logos={logos}></LogoCarousel>
                </Section>
            </main>
            <div className={clsx('hero', styles.hero)}>
                <div className="container text--center">
                <h3 className="hero__subtitle">
                    ChaosBlade is a <a href="https://cncf.io/">Cloud Native Computing Foundation</a> sandbox project
                </h3>
                <div className={clsx('cncf-logo', styles.cncfLogo)} />
                </div>
            </div>
        </Layout>
    )
}

export default Home