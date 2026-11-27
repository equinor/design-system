/**
 * What resetting a layer for a Manual fix also removes and sets again, as a
 * list, for the places with room for one: the "How to fix it" dialog in
 * Changes and the Review step. A row shows the same in one sentence.
 */
import { OTHER_PLUGIN_DATA_NOTE, resetEffectsLead } from '../../scan/classify'

export function ResetEffects({
  effects,
  byPlugin = true,
  layer,
}: {
  effects?: string[]
  /** False when only a designer can make the fix, who then sets them again */
  byPlugin?: boolean
  /** The layer's name, when the list is one of several */
  layer?: string
}) {
  if (!effects || effects.length === 0) return null
  return (
    <div className="reset-effects">
      <p>
        {layer && <strong>{layer}: </strong>}
        {resetEffectsLead(byPlugin)}
      </p>
      <ul>
        {effects.map((effect) => (
          <li key={effect}>{effect}</li>
        ))}
      </ul>
      {byPlugin && <p>{OTHER_PLUGIN_DATA_NOTE}</p>}
    </div>
  )
}
