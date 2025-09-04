// scrape-eds.js
// Scrapes eds.equinor.com, iterates the specified sidebar <ul>,
// converts #main-content > div to Markdown, and writes .md files.
/*
syntax: node scrape-eds.js <url> <dir>
example: 
node scrape-eds.js https://eds.equinor.com/0b0c666ab/p/378906-about-eds about 

example: 
node scrape-eds.js https://eds.equinor.com/0b0c666ab/p/114dfd-accessibility foundation 

example: 
node scrape-eds.js https://eds.equinor.com/0b0c666ab/p/99b362-components components 

example: 
node scrape-eds.js https://eds.equinor.com/0b0c666ab/p/196746-resources resources 

example: 
node scrape-eds.js https://eds.equinor.com/0b0c666ab/p/29134f-support support 

*/

const { chromium } = require('playwright')
const TurndownService = require('turndown')
const fs = require('fs/promises')
const path = require('path')
const slugify = require('slugify')

const OUTPUT_DIR = 'docs'

// Your exact selector. Note the escaped id that starts with a digit.
const MENU_UL_SELECTOR = 'ul.Sidebarstyled__SidebarStyled-nArwk.sidebar'

const MAIN_SELECTOR = '#main-content > div'

function toAbs(pageUrl, href) {
  if (!href) return null
  const base = new URL(pageUrl)
  return new URL(href, base.origin).toString()
}

async function ensureDir(dir) {
  console.log(`Ensuring directory exists: ${dir}`)

  await fs.mkdir(dir, { recursive: true })
}

function mkSlug(text) {
  return slugify(text, { lower: true, strict: true }) || 'page'
}

async function collectMenuTree(page) {
  await page.waitForSelector(MENU_UL_SELECTOR, { state: 'attached' })

  const tree = await page.$$eval(MENU_UL_SELECTOR, (uls) => {
    const root = uls[0]

    const txt = (el) => (el?.textContent || '').trim()
    const href = (a) => (a && a.getAttribute('href')) || null

    // LIs whose closest UL ancestor is the current UL
    const immediateLis = (ul) =>
      Array.from(ul.querySelectorAll('li')).filter(
        (li) => li.closest('ul') === ul,
      )

    // Child ULs whose closest LI ancestor is this LI
    const childUlsOfLi = (li) =>
      Array.from(li.querySelectorAll('ul')).filter(
        (ul) => ul.closest('li') === li,
      )

    const parse = (ul) => {
      const nodes = []
      for (const li of immediateLis(ul)) {
        const isCategory = !!li.querySelector('.sidebar--category')
        const isPage =
          li.classList.contains('sidebar--page') ||
          !!li.querySelector('.sidebar--page')
        const tabA = li.querySelector('.sidebar--tab div a[href]')
        console.log(tabA ? `Found tab: ${txt(tabA)}` : 'No tab found')

        const children = childUlsOfLi(li).flatMap(parse)

        if (isCategory) {
          const titleEl =
            li.querySelector('.sidebar--category a[href]') ||
            li.querySelector('.sidebar--category span')
          nodes.push({
            type: 'category',
            title: txt(titleEl) || 'Category',
            href: titleEl && titleEl.tagName === 'A' ? href(titleEl) : null,
            children,
          })
          continue
        }

        if (isPage) {
          const a = li.querySelector('a[href]')
          nodes.push({
            type: 'page',
            title: txt(a) || 'Page',
            href: href(a),
            children,
          })
          continue
        }

        if (tabA) {
          nodes.push({
            type: 'tab',
            title: txt(tabA) || 'Tab',
            href: href(tabA),
            children: [],
          })
          continue
        }

        if (children.length) nodes.push(...children)
      }
      return nodes
    }

    return parse(root)
  })

  return tree
}

function createTurndown() {
  const td = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '_',
  })

  // Keep code tags cleaner
  td.addRule('inlineCodeCleanup', {
    filter: ['code'],
    replacement: (content) => '`' + content.replace(/\s+/g, ' ').trim() + '`',
  })

  // Strip repetitive navigation bits if they sneak in
  td.addRule('stripNav', {
    filter: (node) =>
      node.nodeType === 1 && ['NAV', 'ASIDE', 'FOOTER'].includes(node.nodeName),
    replacement: () => '',
  })

  return td
}

async function extractMarkdownFromPage(page) {
  await page.waitForSelector(MAIN_SELECTOR, { state: 'visible' })
  // Title
  let title
  try {
    title = await page.$eval('h1, .page-title h1', (el) =>
      el.textContent?.trim(),
    )
  } catch (e) {
    // Element not found
    title = null
  }

  title = title || (await page.title()) || 'Missing Title'

  // Pull only the inner HTML of the content container
  const html = await page.$eval(MAIN_SELECTOR, (el) => el.innerHTML)

  const turndown = createTurndown()

  // Add rule to discard anchor tags completely
  turndown.addRule('discardAnchors', {
    filter: 'a',
    replacement: function () {
      return '' // Dont return anything, we want to get rid of them completely
    },
  })
  // Add rule to discard img tags
  turndown.addRule('discardImages', {
    filter: 'img',
    replacement: function () {
      return '' // Dont return anything, we want to get rid of them completely
    },
  })

  // Add array of keywords to filter out elements containing these terms
  const filterKeywords = [
    'Component',
    'Demo',
    'Variants',
    'More examples available in',
    'States',
    "Do's and don'ts",
  ]
  //const filterKeywords = ['Demo']; // case-insensitive

  function ownText(el) {
    return Array.from(el.childNodes || [])
      .filter((n) => n.nodeType === 3) // 3 === TEXT_NODE
      .map((n) => n.nodeValue)
      .join('')
      .trim()
  }

  // Add this BEFORE Turndown's default heading rule
  turndown.addRule('dropHeadingsByKeyword', {
    filter: (node) => {
      if (node.nodeType !== 1) return false // 1 === ELEMENT_NODE
      if (!/^H[1-6]$/.test(node.nodeName)) return false // only headings
      const text = ownText(node).toLowerCase()
      return filterKeywords.some((k) => text.includes(k.toLowerCase()))
    },
    replacement: () => '', // remove that heading only
  })

  // Add rule to discard elements with react-renderer node-storybook classes
  turndown.addRule('discardReactStorybook', {
    filter: function (node) {
      if (node.nodeType !== 1) return false
      const className = node.getAttribute && node.getAttribute('class')
      if (!className) return false
      return (
        className.includes('react-renderer') ||
        className.includes('node-storybook')
      )
    },
    replacement: function () {
      return '' // Remove these elements completely
    },
  })

  let md = turndown.turndown(html)

  // Add top level title
  const safeTitle = title?.trim() || 'Untitled'
  md = `# ${safeTitle}\n\n` + md

  return { title: safeTitle, markdown: md }
}

async function savePageMarkdown(page, url, title, dirPath, filename = null) {
  await page.goto(url, { waitUntil: 'networkidle' })
  const { markdown } = await extractMarkdownFromPage(page)
  const baseName = filename || `${mkSlug(title)}.md`
  await ensureDir(dirPath)
  await fs.writeFile(path.join(dirPath, baseName), markdown, 'utf8')
}

async function saveNode(page, node, parentDir) {
  const hasChildren = node.children && node.children.length > 0
  const nodeDir = path.join(parentDir, mkSlug(node.title))
  const cleanedTitle = node.title.replace(/\s+/g, '_').replace(/\//g, '-')

  //const nodeDir = parentDir;
  console.log('nodeDir :' + nodeDir)

  console.log(`Processing node: ${node.title} (${node.type})`)

  if (hasChildren) {
    // Create directory if this is a category node
    // Page nodes don't need their own directories since their content
    // will be combined with parent's content
    if (node.type !== 'page') {
      await ensureDir(nodeDir)
    }

    // Initialize combined markdown content
    let combinedMarkdown = ''

    // First, if the main node has content, add it
    if (node.href) {
      await page.goto(toAbs(page.url(), node.href), {
        waitUntil: 'networkidle',
      })
      const { markdown } = await extractMarkdownFromPage(page)
      combinedMarkdown += markdown + '\n\n'
      console.log(`Added main content for ${node.title}`)
    }

    // Then, for each child node, add its content to the combined file
    for (const child of node.children) {
      if (child.href && child.title !== 'Overview') {
        await page.goto(toAbs(page.url(), child.href), {
          waitUntil: 'networkidle',
        })
        const { markdown } = await extractMarkdownFromPage(page)

        // For subpages, replace the top-level header with a section header
        const contentWithoutTopHeader = markdown.replace(/^# .+\n\n/, '')
        combinedMarkdown += `\n\n# ${child.title}\n\n${contentWithoutTopHeader}\n\n`
        console.log(`Added content for ${child.title}`)

        await page.waitForTimeout(150)
      } else {
        console.log('Discarding Overview page')
      }

      // Process children with their own children recursively
      if (child.children && child.children.length > 0) {
        await saveNode(page, child, nodeDir)
      }
    }

    // Save the combined markdown as index.md
    if (combinedMarkdown) {
      console.log(parentDir)
      await fs.writeFile(
        path.join(parentDir, cleanedTitle + '.md'),
        combinedMarkdown.trim(),
        'utf8',
      )
      console.log(`Saved combined content to ${parentDir}/${node.title}.md`)
      console.log(
        '///////////////////////////////////////////////////////////////////////////////////////////////////////////////////',
      )
    }
  } else {
    if (node.href) {
      await ensureDir(parentDir)
      console.log(`Saving page for ${cleanedTitle} to ${parentDir}`)
      console.log(
        '///////////////////////////////////////////////////////////////////////////////////////////////////////////////////',
      )
      await savePageMarkdown(
        page,
        toAbs(page.url(), node.href),
        node.title,
        parentDir,
        `${mkSlug(cleanedTitle)}.md`,
      )
    }
  }
}
async function main() {
  // Process command line arguments
  const args = process.argv.slice(2)
  var customUrl = args[0]
  var customDir = OUTPUT_DIR + '/' + args[1]
  console.log(`Custom directory provided: ${customDir}`)

  await ensureDir(customDir)

  if (customUrl) {
    console.log(`Custom URL provided: ${customUrl}`)
  }
  if (!customUrl) {
    console.log(
      'No custom URL provided, using default: https://eds.equinor.com',
    )
    customUrl = 'https://eds.equinor.com'
  }

  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext()
  const page = await ctx.newPage()

  console.log('Starting EDS scraper...')

  // Go to start page
  await page.goto(customUrl, { waitUntil: 'domcontentloaded' })
  console.log(`Navigated to ${customUrl}`)

  // Wait a bit for client-side render, or else the sidebar--tab wont show up
  await page.waitForLoadState('networkidle').catch(() => {})

  const tree = await collectMenuTree(page)
  console.log(`Collected ${tree.length} top-level nodes from the menu.`)

  for (const node of tree) {
    await saveNode(page, node, customDir)
  }

  await browser.close()
  console.log('Done')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
