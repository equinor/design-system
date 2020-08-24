/* eslint react/jsx-filename-extension: off  */
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useCurrentDoc, useDocs } from 'docz'
import { Helmet } from 'react-helmet-async'
import * as R from 'ramda'
import { Icon, TableOfContents, Typography } from '@equinor/eds-core-react'
import { H1 } from '../../../components/Titles'
import { Tabs, Tab, TabLink } from '../../../components/Tabs'
import { EditPageOnGithub } from '../../../components/EditPageOnGithub'
import { slugify } from '../../../utils/'
import {
  save,
  thumbs_down,
  thumbs_up,
  info_circle,
  subdirectory_arrow_right,
  download,
  mood_sad,
  more_verticle,
  settings,
  person_add,
  share,
  account_circle,
  accessible,
  notifications,
  fullscreen,
  grid_on,
  attach_file,
  edit,
  delete_to_trash,
} from '@equinor/eds-icons'

Icon.add({
  save,
  thumbs_down,
  thumbs_up,
  info_circle,
  subdirectory_arrow_right,
  download,
  mood_sad,
  more_verticle,
  settings,
  person_add,
  share,
  account_circle,
  accessible,
  notifications,
  fullscreen,
  grid_on,
  attach_file,
  edit,
  delete_to_trash,
})

const { LinkItem } = TableOfContents

const ContentHeader = styled.div`
  background: #f7f7f7;
  padding: 2rem;
  display: grid;
  align-content: space-between;
  min-height: 10rem;
  @media (min-width: 600px) {
    height: 6rem;
    min-height: auto;
  }
`

const Wrapper = styled.div`
  max-width: 65rem;
`

const StyledTableOfContents = styled(TableOfContents)`
  position: static;
  margin: 3rem 2rem 0 2rem;
  box-sizing: content-box;
  @media (min-width: 1200px) {
    float: right;
    position: sticky !important;
    top: 80px !important;
    display: inline-block;
  }
`

const Content = styled.div`
  padding: 3rem 2rem;
  max-width: 42rem;
  /*  & > h2,
  & > h3,
  & > h4,
  & > h5,
  & > h6,
  & > p,
  & > ul,
  & > ol,
  & > blockquote {
    max-width: 39rem;
  } */
  h2 + p,
  h3 + p,
  h4 + p,
  h5 + p,
  h6 + p,
  p:first-child {
    margin-top: 0;
  }
`
const LandingPage = styled.div``

export const MainContainer = ({ children, doc, ...rest }) => {
  const {
    tabs: rawTabs,
    title,
    toc,
    route,
    mode = 'draft',
    type = 'contentPage',
    slug,
  } = doc.value

  const docs = useDocs()

  const drafts = useMemo(
    () =>
      R.pipe(
        R.map(R.pick(['route', 'mode'])),
        R.filter((doc) => doc.mode.toLowerCase() === 'draft'),
      )(docs),
    [docs],
  )

  const findByRoute = (collection) => (route) => {
    return R.find(R.propEq('route', route), collection)
  }

  const isDraft = findByRoute(drafts)

  const reduceIndexed = R.addIndex(R.reduce)

  const publishedTabs = (drafts) => (route) => (tabs) =>
    R.pipe(
      reduceIndexed(
        (acc, curr, i) => [
          ...acc,
          {
            label: curr,
            route:
              route.match(/^\/([a-z-]+\/?){2}/)[0] +
              (i === 0
                ? ''
                : R.pipe(R.toLower, R.curry(R.replace)(/\s/g, '-'))(curr) +
                  '/'),
          },
        ],
        [],
      ),
      R.filter((tab) => !isDraft(tab.route)),
      R.tap(console.log),
    )(tabs)

  const curriedPublishedTabs = publishedTabs(drafts)(route)

  const tabs = rawTabs ? curriedPublishedTabs(rawTabs) : []

  /* filter tabs here */

  const withTabs = tabs.length > 0
  const isContentPage = type !== 'landingPage'
  const isPublished = (mode || '').toLowerCase() === 'publish'
  const current = useCurrentDoc()
  const isPrivate =
    mode.toLowerCase() === 'draft' && process.env.GATSBY_STAGE === 'prod'

  return (
    <main {...rest} id="main">
      {isContentPage ? (
        isPrivate ? (
          <>
            <Helmet>
              <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <ContentHeader>
              <H1>Placeholder</H1>
            </ContentHeader>
          </>
        ) : (
          <>
            <ContentHeader withTabs={withTabs}>
              <H1>
                {title}{' '}
                {!isPublished && (
                  <span className={`ModeBadge ModeBadge--${mode}`}>
                    {mode && `(${mode})`}
                  </span>
                )}
              </H1>
              {tabs && (
                <nav aria-label="tabbed content navigation">
                  {
                    <Tabs>
                      {tabs.map((tab) => {
                        return (
                          <Tab key={tab.route}>
                            <TabLink
                              isSelected={current.route === tab.route}
                              href={tab.route}
                            >
                              {tab.label}
                            </TabLink>
                          </Tab>
                        )
                      })}
                    </Tabs>
                  }
                </nav>
              )}
            </ContentHeader>
            <Wrapper>
              {toc && (
                <StyledTableOfContents sticky label="Content">
                  {toc.map((item) => {
                    return (
                      <LinkItem key={item}>
                        <Typography
                          variant="body_short"
                          link
                          href={`#${slugify(item)}`}
                        >
                          <Icon name="subdirectory_arrow_right" size={16} />
                          <span>{item}</span>
                        </Typography>
                      </LinkItem>
                    )
                  })}
                </StyledTableOfContents>
              )}
              <Content>
                {children}

                <EditPageOnGithub slug={slug} />
              </Content>
            </Wrapper>
          </>
        )
      ) : (
        <LandingPage>{children}</LandingPage>
      )}
    </main>
  )
}

MainContainer.propTypes = {
  children: PropTypes.node.isRequired,
  doc: PropTypes.object.isRequired,
}
