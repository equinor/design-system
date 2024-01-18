import { ConfigContext } from 'sanity'

export const getCurrentUserRoles = (context: ConfigContext) => {
  const { currentUser } = context
  return !currentUser ? [] : currentUser.roles.map((role) => role.name)
}
