import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core"

const AIRSTACK_ENDPOINT = "https://api.airstack.xyz/gql"
const AIRSTACK_API_KEY = ""

// Initializing Client 🚀
const client = new ApolloClient({
    uri: AIRSTACK_ENDPOINT,
    cache: new InMemoryCache(),
    headers: { Authorization: AIRSTACK_API_KEY },
})

async function GetAllNFTs(owners: string[], limit: number, cursor: string): Promise<any> {
    const query = gql`
        query MyQuery($cursor: String, $owners: [Identity!], $limit: Int) {
            TokenBalances(
                input: {
                    filter: { owner: { _in: $owners }, tokenType: { _in: [ERC1155, ERC721] } }
                    blockchain: ethereum
                    limit: $limit
                    cursor: $cursor
                }
            ) {
                TokenBalance {
                    tokenAddress
                    amount
                    tokenType
                    owner {
                        primaryDomain {
                            name
                        }
                    }
                }
                pageInfo {
                    prevCursor
                    nextCursor
                }
            }
        }
    `

    const response = await client.query({
        query,
        variables: {
            owners: owners,
            limit: limit,
            cursor: cursor,
        },
    })
    return response.data.TokenBalances
}

const main = async () => {
    let owners = ["vitalik.eth", "dwr.eth"]

    let limit = 10
    let cursor = ""
    let tokenBalances = await GetAllNFTs(owners, limit, cursor)
    tokenBalances.TokenBalance.forEach((tokenBalance: any) => {
        console.log(tokenBalance)
    })
    // cursors
    console.log(`prevCursor: ${tokenBalances.pageInfo.prevCursor}`)
    console.log(`nextCursor: ${tokenBalances.pageInfo.nextCursor}`)
}
main()
