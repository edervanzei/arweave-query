export type ArweaveGateway = {
  protocol: string;
  host: string;
  port: number;
}

export type ArweaveSort = 'asc' | 'desc';

export interface IArweaveResponseHandler {
  handle: (response: ArweaveResponse) => any;
}

export type ArweaveBasicData = {
  id: string,
  owner: string,
  recipient: string,
  fee: string,
  tags: { name: string, value: string }[],
  cursor: string
}

export type ArweaveResponse = {
  data: {
    transactions: {
      pageInfo: { hasNextPage: boolean, __typename: string },
      edges: {
        __typename: string,
        cursor: string,
        node: {
          id: string,
          anchor: string,
          signature: string,
          recipient: string,
          owner: { address: string, key: string, __typename: string },
          fee: { winston: string, ar: string, __typename: string },
          quantity: { winston: string, ar: string, __typename: string },
          data: { size: string, type: string, __typename: string },
          bundledIn: { id: string, __typename: string },
          tags: { name: string, value: string, __typename: string }[],
          block: {
            id: string,
            timestamp: number,
            height: number,
            previous: string,
            __typename: string
          },
          __typename: string
        }
      }[]
    }
  }
}