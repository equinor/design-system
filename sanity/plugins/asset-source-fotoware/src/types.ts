// https://learn.fotoware.com/Integrations_and_APIs/001_The_FotoWare_API/FotoWare_API_Overview/Asset_representation
export type FWAsset = {
  href: string
  archiveHREF: string
  linkstance: string
  created: string
  modified: string
  filename: string
  filesize: number
  uniqueid: string
  doctype: string
  permissions: string[]
  previews: any[]
  quickRenditions: any[]
  metadataEditor: {
    name: string
    href: string
  }
  renditions: any[]
  attributes: {
    imageattributes: any
    photoAttributes: any
  }
  builtinFields: FWAttributeField[]
  metadata: {
    // https://learn.fotoware.com/On-Premises/Getting_started/Metadata_in_the_FotoWare_system/04_Operators_to_search_in_specific_fields/XMP_Field_code_reference
    // Unique Document ID
    187?: {
      value: string
    }
    // Person shown in the Image
    368?: {
      value: string[]
    }
  }
  ancestors: any[]
  props: any
}

export type FWAttributeField = {
  field: string
  required: boolean
  value: any
}
