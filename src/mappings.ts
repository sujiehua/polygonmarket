import { near, JSONValue, json, ipfs, log } from "@graphprotocol/graph-ts"
import { Token, User } from "../generated/schema"

//These mappings will handle events for when a new token is minted or bought. When these actions happen,
 //the mappings will save the data into the subgraph.
export function handleReceipt(
  receipt: near.ReceiptWithOutcome
): void {
  const actions = receipt.receipt.actions;
  for (let i = 0; i < actions.length; i++) {
    handleAction(actions[i], receipt)
  }
}

function handleAction(
  action: near.ActionValue,
  receiptWithOutcome: near.ReceiptWithOutcome
): void {
  if (action.kind != near.ActionKind.FUNCTION_CALL) {
    return;
  }
  const outcome = receiptWithOutcome.outcome;
  const functionCall = action.toFunctionCall();
  const ipfsHash = 'bafybeiew2l6admor2lx6vnfdaevuuenzgeyrpfle56yrgse4u6nnkwrfeu'
  const methodName = functionCall.methodName

  if (methodName == 'buy' || methodName == 'nft_mint_one') {
    for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
      const outcomeLog = outcome.logs[logIndex].toString();

      log.info('outcomeLog {}', [outcomeLog])

      const parsed = outcomeLog.replace('EVENT_JSON:', '')

      const jsonData = json.try_fromString(parsed)
      const jsonObject = jsonData.value.toObject()

      const eventData = jsonObject.get('data')
      if (eventData) {
        const eventArray:JSONValue[] = eventData.toArray()

        const data = eventArray[0].toObject()
        const tokenIds = data.get('token_ids')
        const owner_id = data.get('owner_id')
        if (!tokenIds || !owner_id) return

        const ids:JSONValue[] = tokenIds.toArray()
        const tokenId = ids[0].toString()

        let token = Token.load(tokenId)

        if (!token) {
          token = new Token(tokenId)
          token.tokenId = tokenId
          
          token.image = ipfsHash + '/' + tokenId + '.png'
          const metadata = ipfsHash + '/' + tokenId + '.json'
          token.metadata = metadata
  
          const metadataResult = ipfs.cat(metadata)
          if (metadataResult) {
            const value = json.fromBytes(metadataResult).toObject()
            if (value) {
              const kind = value.get('kind')
              if (kind) {
                token.kind = kind.toString()
              }
              const seed = value.get('seed')
              if (seed) {
                token.seed = seed.toI64() as i32
              }
            }
          }
        }

        token.ownerId = owner_id.toString()
        token.owner = owner_id.toString()

        let user = User.load(owner_id.toString())
        if (!user) {
          user = new User(owner_id.toString())
        }

        token.save()
        user.save()
      }
    }
  }
}
