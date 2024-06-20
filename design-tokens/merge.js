const fsPromises = require('fs').promises
const fs = require('fs')
const JSON5 = require('json5')

async function execute() {
  const extractNewValue = (data, modeCategory, modeValue) => {
    const oldValue = data.$value
    const pathToNewValue = oldValue
      .substring(1, oldValue.length - 1) // Stripping off the {}'s
      .split('.') // Putting the path into an array
    let newData = modeFiles.get(`${modeCategory}.${modeValue}`)
    for (let i = 0; i < pathToNewValue.length; ++i) {
      if (newData[pathToNewValue[i]]) {
        newData = newData[pathToNewValue[i]]
      } else {
        newData = data
        break
      }
    }
    return newData.$value
  }
  const expandTree = (object, modeCat, modeVal) => {
    const res = {}
    Object.entries(object).forEach(([key, value]) => {
      // Signifies that we have to replace this node with new nodes for all modeValues
      if (key.indexOf('<') === 0) {
        const secondSeparator = key.indexOf('>', 1)
        const modeCategory = key.substring(1, secondSeparator)
        const modeValues = modes[modeCategory]

        if (modeValues) {
          modeValues.forEach((modeValue) => {
            const newKey = modeValue + key.substring(secondSeparator + 1)
            // If the sub-object contains value
            if (value.$value) {
              const newValue = extractNewValue(value, modeCategory, modeValue)
              res[newKey] = { ...value, $value: newValue }
            } else {
              res[newKey] = expandTree(value, modeCategory, modeValue)
            }
          })
        } else {
          console.error(
            `🧐 No available mode-files for mode-category '${modeCategory}' - this tree was not modified`,
          )
          res[key] = value // TODO consider if this should be handled differently
        }
        // LEAF
      } else if (typeof value.$type === 'string') {
        // Replace values if necessary if the node is in a tree below a variable
        if (modeCat && modeVal) {
          const newValue = extractNewValue(value, modeCat, modeVal)
          res[key] = { ...value, $value: newValue }
        } else {
          res[key] = value
        }
        // Recursively traverse the tree
      } else {
        if (modeCat && modeVal) {
          res[key] = expandTree(value, modeCat, modeVal) // This assumes that under each expanded node we need to change the $value
        } else {
          res[key] = expandTree(value)
        }
      }
    })
    return res
  }

  async function mergeFiles() {
    try {
      const data = await fsPromises.readFile(
        './src/color/semantic.tokens.json5',
      )
      const file = Buffer.from(data).toString()
      const semanticTokens = JSON5.parse(file)
      const newJson = expandTree(semanticTokens)

      fs.writeFile(
        './build/semantic.tokens.expanded.json5',
        JSON5.stringify(newJson, null, 2),
        function (err) {
          if (err) throw err
          console.log('✅  File was successfully saved')
        },
      )
    } catch (e) {
      console.error(e)
    }
  }

  async function readFiles() {
    const files = await fsPromises.readdir('./src/color/modes')
    const modeFiles = new Map()
    const modes = {}

    for (const file of files) {
      const firstSeparator = file.indexOf('.')
      const secondSeparator = file.indexOf('.', firstSeparator + 1)
      const modeCategory = file.substring(0, firstSeparator)
      const mode = file.substring(firstSeparator + 1, secondSeparator)
      if (modes[modeCategory]) {
        modes[modeCategory].push(mode)
      } else {
        modes[modeCategory] = [mode]
      }
      try {
        const data = await fsPromises.readFile(
          `./src/color/modes/${file}`,
          'utf8',
        )
        modeFiles.set(`${modeCategory}.${mode}`, JSON5.parse(data))
      } catch (e) {
        console.error(e)
      }
    }
    return [modeFiles, modes]
  }

  const [modeFiles, modes] = await readFiles()
  mergeFiles()
}

execute()
