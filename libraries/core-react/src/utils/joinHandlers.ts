type Callback<T> = (e: T) => void

export const joinHandlers = <T>(
  handler1?: Callback<T>,
  handler2?: Callback<T>,
): Callback<T> => {
  const callback: Callback<T> = (event) => {
    handler1 && handler1(event)
    handler2 && handler2(event)
  }
  return callback
}
