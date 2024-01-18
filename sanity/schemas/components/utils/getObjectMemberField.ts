import type { ObjectMember, FieldMember } from 'sanity'

export const getObjectMemberField = (members: ObjectMember[], field: string) =>
  members.find((member): member is FieldMember => member.kind === 'field' && member.name === field)
