let _icons = {}
let count = 0
export const add = (icons) => {
  _icons = {
    ..._icons,
    ...icons,
  }
}

export const get = (name) => {
  count += 1
  return { icon: _icons[name], count }
}
