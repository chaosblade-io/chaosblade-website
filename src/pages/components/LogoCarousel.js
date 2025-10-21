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
import styles from './LogoCarousel.module.css'
import Translate from '@docusaurus/Translate';

const INTERVAL_LENGTH = 5000
const LOGO_WIDTH = 150

let ticks = 0

export default class LogoCarousel extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            position: -0,
            activePage: 0,
            swapInterval: 0,
            pages: Math.ceil(props.logos ? props.logos.length / 6 : 1),
            margin: 70
        }

        this.containerRef = React.createRef()
    }

    componentDidMount() {
        const rect = this.containerRef.current.getBoundingClientRect()
        const logosPerPage = Math.floor(rect.width / LOGO_WIDTH)
        this.setState({
            swapInterval: setInterval(this.nextPage.bind(this), INTERVAL_LENGTH),
            pages: Math.ceil(this.props.logos ? this.props.logos.length / logosPerPage : 1),
            margin: rect.width < 700 ? 0 : 70
        })
    }

    componentWillUnmount () {
        clearInterval(this.state.swapInterval)
    }

    animateTo (i) {
        const width = this.containerRef.current.getBoundingClientRect().width - this.state.margin
        const x = i * -width
        this.setState({ position: x, activePage: i })
    }

    handleClick (i) {
        this.animateTo(i)
        clearInterval(this.state.swapInterval)
        this.setState({
            swapInterval: setInterval(this.nextPage.bind(this), INTERVAL_LENGTH)
        })
    }

    nextPage () {
        const pages = this.state.pages - 1
        const direction = Math.floor(ticks / pages) % 2
        this.animateTo(direction
            ? pages - (ticks % pages)
            : ticks % pages
        )
        ++ticks
    }

    render () {
        if (!this.props || !this.props.logos) {
            return (
                <div></div>
            )
        }

        this.buttons = () => [...Array(this.state.pages)].map((_, index) => (
            <button onClick={() => this.handleClick(index)} key={index} className={clsx(styles.button, index === this.state.activePage ? styles.buttonActive : '')}>{index + 1}</button>
        ))

        this.list = () => (
            <ul style={{ transform: `translate(${this.state.position}px, 0px)` }}>
                {this.props.logos.map((value, index) => (
                    <li key={index}><a href={value.url} target="_blank" rel="noopener noreferrer"><img src={'/img/logos/' + value.img} alt={value.alt} /></a></li>
                ))}
            </ul>
        )

        return (
            <div className={styles.companyUsage} ref={this.containerRef}>
                <h3><Translate>Who is using ChaosBlade?</Translate></h3>
                <div className={clsx(styles.logos)}>
                    {this.list()}
                    <div className={styles.logoNavigation}>
                        {this.buttons()}
                    </div>
                </div>
            </div>
        )
    }
}
