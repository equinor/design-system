import { languages } from '../languages'

const routes = languages.map((lang) => ({ type: `route_${lang.name}` }))
const routesHomepage = languages.map((lang) => ({ type: `route_${lang.name}_homepage` }))

export default [...routes, ...routesHomepage]
