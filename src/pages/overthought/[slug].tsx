import * as React from 'react'
import { Post } from '~/graphql/types.generated'
import { GET_POST, GET_POSTS } from '~/graphql/queries'
import Page from '~/components/Page'
import PostContainer from '~/components/Overthought/Post'
import NotFound from '~/components/Overthought/NotFound'
import { getStaticApolloClient } from '~/graphql/api'

interface Props {
  slug: string
  data: {
    post: Post
    posts: Post[]
  }
}

function OverthoughtPost({ data }: Props) {
  const post = data?.post
  const posts = data?.posts

  if (!post) return <NotFound />

  return (
    <Page withHeader>
      <PostContainer post={post} posts={posts} />
    </Page>
  )
}

export async function getStaticPaths() {
  const client = await getStaticApolloClient()
  const { data } = await client.query({ query: GET_POSTS })

  if (!data) return { paths: [], fallback: true }

  const paths = data.posts.map(({ slug }) => ({
    params: { slug },
  }))

  return { paths, fallback: true }
}

export async function getStaticProps({ params: { slug } }) {
  const client = await getStaticApolloClient()
  const { data } = await client.query({
    query: GET_POST,
    variables: { slug, first: 5 },
  })

  return {
    props: {
      slug,
      data: {
        post: data.post,
        posts: data.posts,
      },
    },
  }
}

export default OverthoughtPost
