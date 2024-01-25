import resolveProductionUrl from '../../resolveProductionUrl'
import styled from 'styled-components'
import { dataset } from '../lib/datasetHelpers'
import { PreviewWrapper } from './PreviewWrapper'

const Frame = styled.iframe`
  border: 0;
  height: 100%;
  left: 0;
  width: 100%;
`

const REQUIRES_SLUG = ['news', 'localNews', 'magazine']

export default function Preview({ document }: any) {
  const { displayed: previewDoc } = document
  const { _type } = previewDoc

  /* This logic is duplicated from web/preview.js
   * just so we render the error in a prettified way.
   */
  if (REQUIRES_SLUG.includes(_type) || _type.includes('route')) {
    if (!previewDoc?.slug?.current) {
      return (
        <div style={{ margin: '30px' }}>
          The document needs a <strong>slug</strong> before it can be previewed.
        </div>
      )
    }
  }

  const url = resolveProductionUrl(previewDoc)

  return (
    <PreviewWrapper src={url} shareable={dataset !== 'secret'}>
      <Frame src={url} title="preview" frameBorder={'0'} />
    </PreviewWrapper>
  )
}
