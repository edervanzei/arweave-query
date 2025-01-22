import { ArweaveBasicData, ArweaveGateway, ArweaveResponse, IArweaveResponseHandler } from './models';

export const DEFAULT_GATEWAY: ArweaveGateway = {
  protocol: 'https',
  host: 'arweave.net',
  port: 443
};

export class BasicArweaveResponseHandler implements IArweaveResponseHandler {
  public handle(response: ArweaveResponse): ArweaveBasicData[] {
    return response.data.transactions.edges.map(el => {
      return {
        id: el.node.id,
        owner: el.node.owner.address,
        recipient: el.node.recipient,
        fee: el.node.fee.winston,
        cursor: el.cursor,
        tags: el.node.tags.map(tag => {
          return {
            name: tag.name,
            value: tag.value
          };
        })
      };
    }) as ArweaveBasicData[];
  }
}