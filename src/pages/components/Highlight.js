import React from 'react'
import clsx from 'clsx'

import styles from './highlight.module.css'

export default function Highlight({ reversed, title, img, text, isDark }) {
    const left = <div className={clsx('col col--6', styles.hfeatureImage, reversed ? styles.hfeatureImageReversed : '')}>{img}</div>
    const right = (
        <div className={clsx('col col--6', styles.hfeatureContent, reversed ? styles.hfeatureContentReversed : '')}>
            <h3 className={styles.hfeatureTitle}>{title}</h3>
            {text}
        </div>
    )

    return (
        <section className={clsx('highlightSection', isDark ? styles.darkSection + ' darkSection' : '')}>
            <div className="container">
                <div className="row">
                    {reversed ? (
                        <>
                            {right}
                            {left}
                        </>
                    ) : (
                        <>
                            {left}
                            {right}
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}
