import { readSources, readTokenNames } from '../../lib/sources'
import { Workbench } from './_components/Workbench'

export default function Page() {
  return <Workbench sources={readSources()} tokenNames={readTokenNames()} />
}
