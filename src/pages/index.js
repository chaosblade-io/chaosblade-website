import React from 'react'
import clsx from 'clsx'
import Layout from '@theme/Layout'
// import CodeBlock from '@theme/CodeBlock'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import Translate from '@docusaurus/Translate';

import LogoCarousel from './components/LogoCarousel'
import Feature from './components/Feature'
import Section from './components/Section'
import Highlight from './components/Highlight'

import styles from './styles.module.css'
import { logos, features } from '../data'



function Home() {
    const context = useDocusaurusContext()
    const { siteConfig = {} } = context
    return (
        <Layout
            title={`${siteConfig.title} · ${siteConfig.tagline}`}
            description={`${siteConfig.tagline}`}>
            <header className={clsx('hero hero--primary', styles.heroBanner)}>
                <div className="container">
                    <div className="row">
                        <div className="col col--6">
                            <h1 className="hero__logo">
                                <img src="/img/logo.png" alt="logo" />
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
                                    to={useBaseUrl('/docs')}>
                                    <Translate>Get Started</Translate>
                                </Link>
                                <Link
                                    to="https://github.com/chaosblade-io/chaosblade"
                                    className={clsx(
                                        'button button--outline button--secondary button--lg',
                                        styles.getStarted,
                                    )}
                                >
                                    <Translate>Learn More</Translate>
                                </Link>
                            </div>
                        </div>
                        <div className="col col--6">
                            <h1 className="hero__title">
                                <img className={styles.homeImg} src="/img/homepage-img.png" alt="homepage" />
                            </h1>
                        </div>
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
                    title={<Translate>What is ChaosBlade</Translate>}
                    text={
                        <>
                            <p>
                            <Translate>ChaosBlade is a cloud-native chaos engineering platform that supports multiple environments, clusters, and languages.</Translate>
                            </p>
                            <p>
                            <Translate>It includes the chaosblade-box chaos engineering platform and the chaosblade chaos engineering tool.</Translate>
                            </p>
                        </>
                    }
                />
                {features && features.length > 0 && (
                    <Section className="highlightSection">
                        {features.map((props, idx) => (
                            <Feature key={idx} {...props} />
                        ))}
                    </Section>
                )}
                <div className="msemap-container">
                    <h3 style={{fontSize: "2rem", fontWeight: 700, textAlign: "center"}}>
                        <Translate>Microservice Ecosystem Landscape</Translate>
                    </h3>
                    <div id="mse-arc-container"></div>
                </div>
                <Section isDark>
                    {/* <LogoCarousel logos={logos}></LogoCarousel> */}
                    <div className={styles.companyUsage}>
                    <div className="container text--center">
                        <h2>
                        <Translate>Who is using ChaosBlade?</Translate>
                        </h2>
                        <div className="row">
                            {logos.map((w) => (
                            <div key={w.name} className={clsx('col col--2', styles.whiteboardCol)}>
                                <a className={styles.logoWrapper} href={w.url} target="_blank">
                                <img style={w.style} src={'/img/logos/' + w.img} alt={w.name} />
                                </a>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
                </Section>
                
            </main>
            <div className={clsx('hero', styles.hero)}>
                <div className="container text--center">
                <h3 className="hero__subtitle">
                <Translate>ChaosBlade is a</Translate> <a href="https://cncf.io/">Cloud Native Computing Foundation</a> <Translate>sandbox project</Translate>
                </h3>
                <div className={clsx('cncf-logo', styles.cncfLogo)} />
                </div>
            </div>
        </Layout>
    )
}

export default Home
