import * as React from 'react'
import Page, { SectionHeading } from '~/components/Page'
import { H3 } from '~/components/Typography'
import { NextSeo } from 'next-seo'
import { useGetBookmarksQuery } from '~/graphql/types.generated'
import BookmarksList from '~/components/Bookmarks'
import { GET_BOOKMARKS } from '~/graphql/queries'
import { useAuth } from '~/hooks/useAuth'
import AddBookmark from '~/components/Bookmarks/AddBookmark'
import { getStaticApolloClient } from '~/graphql/api'
import { withApollo } from '~/components/withApollo'

function Bookmarks() {
  // pre-populate bookmarks from the cache, but check for any new ones after
  // the page loads
  const { data } = useGetBookmarksQuery({ fetchPolicy: 'cache-and-network' })
  const { bookmarks } = data
  const { isMe } = useAuth()

  return (
    <Page withHeader>
      <NextSeo title={'Bookmarks'} />
      <SectionHeading data-cy="bookmarks">
        <H3>Bookmarks</H3>
        {isMe && <AddBookmark />}
        {bookmarks && <BookmarksList bookmarks={bookmarks} />}
      </SectionHeading>
    </Page>
  )
}

export async function getStaticProps() {
  const client = await getStaticApolloClient()
  await client.query({ query: GET_BOOKMARKS })
  /*
    Because this is using withApollo, the data from this query will be
    pre-populated in the Apollo cache at build time. When the user first
    visits this page, we can retreive the data from the cache like this:

    const { data } = useGetBookmarksQuery({ fetchPolicy: 'cache-and-network' })

    This preserves the ability for the page to render all bookmarks instantly,
    then get progressively updated if any new bookmarks come in over the wire.
  */
  return {
    props: {
      apolloStaticCache: client.cache.extract(),
    },
  }
}

export default withApollo(Bookmarks)
