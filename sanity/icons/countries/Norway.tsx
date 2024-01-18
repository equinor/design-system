const Norway = ({ width = 30, height = 30 }: { width: number; height: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width={width}
      height={height}
      viewBox="0 0 30 30"
      id="Flag_of_Norway"
    >
      <defs>
        <clipPath id="a">
          <rect fill="#fff" stroke="#707070" opacity="0.5" width="30" height="30" transform="translate(-18132 149)" />
        </clipPath>
      </defs>
      <g clipPath="url(#a)" transform="translate(18132 -149)">
        <g transform="translate(-18132 149)">
          <rect fill="#ef2b2d" width="41.25" height="30" />
          <rect fill="#fff" width="7.5" height="30" transform="translate(11.25)" />
          <rect fill="#fff" width="41.25" height="7.5" transform="translate(0 11.25)" />
          <rect fill="#002868" width="3.75" height="30" transform="translate(13.125)" />
          <rect fill="#002868" width="41.25" height="3.75" transform="translate(0 13.125)" />
        </g>
      </g>
    </svg>
  )
}

export default Norway
