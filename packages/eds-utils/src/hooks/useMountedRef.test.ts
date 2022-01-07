import { renderHook } from '@testing-library/react-hooks'
import { useIsMounted } from './useMountedRef'

test('should return true when rendered', () => {
  const { result } = renderHook(() => useIsMounted())
  expect(result.current).toBe(true)
})
