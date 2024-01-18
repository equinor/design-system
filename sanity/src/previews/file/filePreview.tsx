import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { sanityClient } from '../../../sanity.client'
// eslint-disable-next-line import/no-unresolved

const Warning = styled.div`
  padding: 2em;
`

type File = {
  url: string
  extension: string
}

export default function FilePreview(props: any) {
  const [file, setFile] = useState<File | false>(false)
  const [loading, setLoading] = useState(true)

  const {
    document: { displayed },
  } = props

  useEffect(() => {
    if (!displayed?.asset?.asset) {
      setLoading(false)
      return
    }
    getFileUrl(displayed.asset.asset._ref)
  }, [displayed, setLoading])

  const getFileUrl = async (id: string) => {
    const file = await sanityClient.fetch(/* groq */ `*[_id == $id][0]{ url, extension }`, {
      id: id,
    })

    setLoading(false)
    setFile(file)
  }

  if (loading) {
    return <Warning>Loading...</Warning>
  }

  if (!displayed?.asset?.asset || !file) {
    return <Warning>A file attachment is required in order to preview.</Warning>
  }

  if (file && file.extension === 'pdf') {
    return <embed type="application/pdf" src={file.url} height="100%" width="100%" title="PDF preview"></embed>
  }

  // TODO: add preview for other file types
  return <Warning>Only PDF files can be previewed at this time.</Warning>
}
