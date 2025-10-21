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
import useBaseUrl from '@docusaurus/useBaseUrl'
import styles from './Feature.module.css'
import Translate, {translate} from '@docusaurus/Translate';

export default function Feature({ imgUrl, title, description, reverse }) {
    return (
      <div className="container">
      <div className={clsx('row', styles.feature, reverse ? styles.featureReverse : '')}>
        <div className="col col--3">
          <div className="text--center">
            {imgUrl && <img className={styles.featureImage} src={useBaseUrl(imgUrl)} alt={'feture-'+title} />}
          </div>
        </div>
        <div className={clsx('col col--9', styles.featureDesc)}>
          <div>
            <h2>{title}</h2>
            <div>{description}</div>
          </div>
        </div>
      </div>
      </div>
    )
  }