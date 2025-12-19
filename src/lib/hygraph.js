// lib/hygraph.js
import { GraphQLClient } from "graphql-request";

const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;

// Create client WITHOUT authorization header for public content
export const client = new GraphQLClient(endpoint);

// Query function
// For getting post
export async function getPost(slug) {
  const query = `
    query GetPost($slug: String!) {
      post(where: {slug: $slug}) {
        content {
          html
          raw
        }
        title
        summary
        publishedAt
      }
    }
  `;

  const variables = { slug };
  const data = await client.request(query, variables);
  return data.post;
}

// For getting Post
export async function getPosts(category) {
  console.log(category);
  const query = `
    query Posts($category: String!) {
      posts(orderBy: publishedAt_DESC, where: {category: $category}) {
        slug
        title
        summary
        publishedAt
      }
    }`;
  const variables = { category };
  const data = await client.request(query, variables);
  return data.posts;
}
