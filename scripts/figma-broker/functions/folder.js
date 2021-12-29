import fs from 'fs'

/**
 * Create folder, checking also if it already exists
 *
 * @export
 * @param {string} dir - The name of the directory that the user wants to create
 */
export const createFolder = (dir) => {
  if (dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  } else {
    throw new Error('No directory specified for createFolder()!')
  }
}
