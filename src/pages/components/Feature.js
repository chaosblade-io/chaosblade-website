import React from 'react'
import clsx from 'clsx'
import useBaseUrl from '@docusaurus/useBaseUrl'
import styles from './Feature.module.css'
import Translate, {translate} from '@docusaurus/Translate';

export default function Feature({ imgUrl, title, description, reverse }) {
    return (
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
    )
  }