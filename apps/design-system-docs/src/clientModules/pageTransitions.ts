/**
 * Client-module half of the route-change view transitions: once Docusaurus
 * commits the new page's DOM, release the pending transition so the browser
 * snapshots the new state and plays the cross-fade.
 *
 * The transition itself is started by the click interceptor in
 * `src/theme/Root.tsx` — see `src/utils/pageTransitions.ts` for why it cannot
 * start here in `onRouteUpdate`. Navigations without a pending transition
 * (back/forward, unsupported browsers, reduced motion) settle as a no-op.
 */

import { settlePageTransition } from '@site/src/utils/pageTransitions'

export function onRouteDidUpdate(): void {
  settlePageTransition()
}
