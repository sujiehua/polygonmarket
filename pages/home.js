// import { createClient } from 'urql'
import {useEffect,useState} from "react";
import  { ExampleQueryDocument,  execute }  from '../.graphclient'
import { ApolloClient, InMemoryCache, gql} from "@apollo/client";
import {data} from "autoprefixer";

const APIURL = 'https://api.thegraph.com/subgraphs/name/sujiehua/zoranfts-subgraph'

const tokensQuery = `
  query($first: Int, $orderBy: BigInt, $orderDirection: String) {
    users(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      tokens {
        id
        ownerId
        tokenId
        image
        metadata
        image
        kind
        seed
      }
    }
  }
`

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
})

client.query({
  query: gql(tokensQuery),
  variables: {
    first: 5,
    orderBy: 'id',
    orderByDirection: 'desc',
  }
})
  .then((data) => console.log('Subgraph data: ', data.data.users))
  .catch((err) => {
    console.log("Error fetching data: " , err);
  })

// const myQuery = gql`
//     query ExampleQuery {
//   users(first: 5) {
//     id
//     tokens {
//       id
//       ownerId
//       tokenId
//       image
//       metadata
//       image
//       kind
//       seed
//     }
//   }
// }
// `
//
// async function main() {
//   const result = await execute(myQuery, {})
//   console.log(result)
// }
//
// main()

// const APIURL = 'https://api.thegraph.com/subgraphs/name/sujiehua/zoranfts-subgraph'
//
// const tokensQuery = `
//   query {
//     users(first: 5) {
//       id
//       tokens {
//         id
//         ownerId
//         tokenId
//         image
//         metadata
//         image
//         kind
//         seed
//       }
//     }
//   }
// `
// const client = createClient({
//   url: APIURL,
// })



// const fetcher = (query) =>
//   fetch('https://api.thegraph.com/subgraphs/name/sujiehua/zoranfts-subgraph', {
//     method: 'POST',
//     headers: {
//       'Content-type': 'application/json',
//     },
//     body: JSON.stringify({ query }),
//   })
//     .then((res) => {
//       console.log(res.data);
//     })
//     // .then((json) => json.data)
//


export default function Home() {

  const [data, setData] = useState()

  useEffect(() => {
    // execute(ExampleQueryDocument, {}).then((result) => {
    //   setData(result.data.users)
    //   // console.log(result.data.users);
    // })
  }, [])

  // const [data, setData] = useState([]);
  //
  // useEffect(async  function (){
  //   const result = await client.query(tokensQuery).toPromise();
  //   // console.log(1, data.data.users);
  //   setData(result.data.users);
  //   console.log(result.data.users);
  // })

// console.log(data);
  return (
    <div>
      {/*{data.map((user, i) => (*/}
      {/*  <div key={i}>{user.id}*/}
      {/*    <ul>*/}
      {/*      {*/}
      {/*        user.tokens.map((token,i) => (*/}
      {/*          <li key={token.tokenId}>*/}
      {/*            /!*<span>{token.kind}</span>*!/*/}
      {/*            /!*<span>{token.metadata}</span>*!/*/}
      {/*            /!*<span>{token.image}</span>*!/*/}
      {/*            /!*<span>{token.seed}</span>*!/*/}
      {/*            /!*<span>{token.ownerId}</span>*!/*/}
      {/*          </li>*/}

      {/*        ))*/}
      {/*      }*/}
      {/*    </ul>*/}
      {/*  </div>*/}
      {/*))}*/}
    </div>
  )
}
