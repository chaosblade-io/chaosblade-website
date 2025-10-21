/*
 * Copyright 2025 The ChaosBlade Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
