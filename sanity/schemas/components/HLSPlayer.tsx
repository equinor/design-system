/* eslint-disable import/no-named-as-default-member */
/* eslint-disable jsx-a11y/media-has-caption */
import { FC, useRef, HTMLProps, useEffect } from 'react'
import Hls from 'hls.js'

type Props = Omit<HTMLProps<HTMLVideoElement>, 'src'> & {
  src: string
}

const HLSPlayer: FC<Props> = ({ src, ...props }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video && Hls.isSupported()) {
      const hls = new Hls()
      hlsRef.current = hls

      hls.loadSource(src)
      hls.attachMedia(video)

      return () => {
        hls.destroy()
      }
    }
  }, [src])

  useEffect(() => {
    const hls = hlsRef.current
    if (hls) {
      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error('Error', data)
      })
    }
  }, [])

  return <video ref={videoRef} {...props} />
}

export default HLSPlayer
