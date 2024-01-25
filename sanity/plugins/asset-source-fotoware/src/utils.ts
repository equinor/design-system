export const HAS_ENV_VARS =
  process.env.SANITY_STUDIO_FOTOWARE_CLIENT_ID &&
  process.env.SANITY_STUDIO_FOTOWARE_TENANT_URL &&
  process.env.SANITY_STUDIO_FOTOWARE_REDIRECT_ORIGIN &&
  process.env.SANITY_STUDIO_FOTOWARE_AF_EXPORT_URL &&
  process.env.SANITY_STUDIO_FOTOWARE_AF_EXPORT_KEY

export const FotowareEvents = ['selectionWidgetCancel', 'assetSelected', 'assetExported']

export const getAuthURL = (requestState: string): string | false => {
  if (!HAS_ENV_VARS) {
    console.warn('Required Fotoware .env variables are not defined. Make sure they are set in the .env file(s)')
    return false
  }

  const CLIENT_ID = process.env.SANITY_STUDIO_FOTOWARE_CLIENT_ID
  const TENANT_URL = process.env.SANITY_STUDIO_FOTOWARE_TENANT_URL

  return `${TENANT_URL}/fotoweb/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}&state=${requestState}`
}

export const getAccessToken = (): string | false => {
  const accessToken = localStorage.getItem('FotowareToken')

  if (!accessToken) return false

  const tokenData = JSON.parse(accessToken)

  const now = Math.floor(new Date().getTime() / 1000.0)

  if (parseInt(tokenData.expires) <= now) {
    localStorage.removeItem('FotowareToken')
    return false
  }

  return tokenData.access_token
}

type FotowareAuthData = {
  access_token: string
  expires_in: string
  state: string
}

export const storeAccessToken = (data: FotowareAuthData): void => {
  const now = Math.floor(new Date().getTime() / 1000.0)

  const tokenData = {
    access_token: data.access_token,
    expires: now + parseInt(data.expires_in),
  }

  localStorage.setItem('FotowareToken', JSON.stringify(tokenData))
}

export const checkAuthData = (data: any): boolean => {
  return (
    typeof data === 'object' &&
    ['access_token', 'expires_in', 'state'].every((key: string) => data[key] && typeof data[key] === 'string')
  )
}

export const getExportURL = (uri: string): string =>
  `${process.env.SANITY_STUDIO_FOTOWARE_AF_EXPORT_URL}?code=${process.env.SANITY_STUDIO_FOTOWARE_AF_EXPORT_KEY}&uri=${uri}`

export const getSelectionWidgetURL = (accessToken: string) => {
  return `${process.env.SANITY_STUDIO_FOTOWARE_TENANT_URL}/fotoweb/widgets/selection?access_token=${accessToken}`
}

export const getExportWidgetURL = (accessToken: string, href: string) => {
  const assetURI = encodeURI(href)
  const publicationText = encodeURI(`Sanity (Dataset: ${process.env.SANITY_STUDIO_API_DATASET})`)
  const params = `access_token=${accessToken}&i=${assetURI}&pub=${publicationText}&&caption=false&action=false&behaviour=false&publication=false&enhance=false`

  return `${process.env.SANITY_STUDIO_FOTOWARE_TENANT_URL}/fotoweb/widgets/publish?${params}`
}

type ErrorTypes = 'generic' | 'auth' | 'export'

export const handleRequestError = (
  message: string,
  setError: (arg0: string) => void,
  type: ErrorTypes = 'generic',
  window: React.MutableRefObject<Window | null> | null = null,
): false => {
  const prefix = ((type) => {
    switch (type) {
      case 'auth':
        return `An error occured while authenticating with Fotoware.`
      case 'export':
        return `An error occured while attempting to retrieve the image.`
      default:
        return `An error occured with the Fotoware integration.`
    }
  })(type)

  console.error(`A Fotoware error occured`, message)
  setError(`<p>${prefix}</p><p>The following message was received:</p> <pre><code>${message}</code></pre>`)

  if (window && window?.current) {
    window.current.close()
  }

  return false
}
