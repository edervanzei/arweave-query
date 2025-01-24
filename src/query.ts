import { DEFAULT_GATEWAY } from './const';
import { ArweaveGateway, ArweaveSort, IArweaveResponseHandler } from './models';
import { convertArweaveGateway } from './utils';

export class ArweaveDataQueryBuilder {
  constructor(private readonly gateway: ArweaveGateway = DEFAULT_GATEWAY) {}

  public async buffer(id: string): Promise<Buffer> {
    const response: Response = await this.fetch(id);
    return Buffer.from(await response.arrayBuffer());
  }

  public async json(id: string): Promise<any> {
    const response: Response = await this.fetch(id);
    return await response.json();
  }

  public async text(id: string): Promise<string> {
    const response: Response = await this.fetch(id);
    return await response.text();
  }

  private async fetch(id: string): Promise<Response> {
    const endpoint: string = `${convertArweaveGateway(this.gateway)}/${id}`;
    const response: Response = await fetch(endpoint);

    if (!response.ok)
      throw new Error(await response.text());

    return response;
  }
}

export class ArweaveMetadataQueryBuilder {
  private ids: Set<string> = new Set();
  private owners: Set<string> = new Set();
  private recipients: Set<string> = new Set();
  private bundles: Set<string> = new Set();
  private tags: Map<string, Set<string>> = new Map();
  private minBlock: number;
  private maxBlock: number;
  private sort: ArweaveSort = 'desc';
  private maxResults: number = 20;
  private after: string;

  public constructor(
    private readonly gateway: ArweaveGateway,
    private readonly responseHandler?: IArweaveResponseHandler
  ) {}

  public from(...addresses: string[]): this {
    addresses.forEach(address => this.owners.add(address));
    return this;
  }

  public to(...addresses: string[]): this {
    addresses.forEach(address => this.recipients.add(address));
    return this;
  }

  public id(...ids: string[]): this {
    ids.forEach(id => this.ids.add(id));
    return this;
  }

  public tag(name: string, ...values: string[]): this {
    if (!this.tags.has(name))
      this.tags.set(name, new Set<string>());

    values.forEach(val => this.tags.get(name)?.add(val));
    return this;
  }

  public first(): this {
    return this.limit(1);
  }

  public limit(n: number): this {
    this.maxResults = n;
    return this;
  }

  public orderBy(sort: ArweaveSort): this {
    this.sort = sort;
    return this;
  }

  public bundleIn(...ids: string[]): this {
    ids.forEach(id => this.bundles.add(id));
    return this;
  }

  public min(minBlock: number): this {
    this.minBlock = minBlock;
    return this;
  }

  public max(maxBlock: number): this {
    this.maxBlock = maxBlock;
    return this;
  }

  public cursor(cursor: string): this {
    this.after = cursor;
    return this;
  }

  public async get(): Promise<any> {
    let ids: string = '';
    if (this.ids.size > 0)
      ids = `ids:["${Array.from(this.ids.keys()).join('","')}"],`;

    let owners: string = '';
    if (this.owners.size > 0)
      owners = `owners:["${Array.from(this.owners.keys()).join('","')}"],`;

    let recipients: string = '';
    if (this.recipients.size > 0)
      recipients = `recipients:["${Array.from(this.recipients.keys()).join('","')}"],`;

    let bundles: string = '';
    if (this.bundles.size > 0)
      bundles = `bundledIn:["${Array.from(this.bundles.keys()).join('","')}"],`;

    let tags: string = '';
    this.tags.forEach((value, key) => {
      const values: string = '"' + Array.from(value.keys()).join('","') + '"';
      tags += `{ name:"${key}", values: [${values}] }`;
    });

    let after: string = '';
    if (this.after)
      after = `after:"${this.after}",`;

    let blockRange: string = '';
    if (this.minBlock && !this.maxBlock)
      blockRange = `block:{min:${this.minBlock}},`;
    else if (!this.minBlock && this.maxBlock)
      blockRange = `block:{max:${this.maxBlock}},`;
    else if (this.minBlock && this.maxBlock)
      blockRange = `block:{min:${this.minBlock},max:${this.maxBlock}},`;

    const query = { query: `{
      transactions(
        ${blockRange}
        ${after}
        ${ids}
        ${owners}
        ${recipients}
        ${bundles}
        tags: [${tags}],
        first: ${this.maxResults},
        sort: ${this.sort === 'asc' ? 'HEIGHT_ASC' : 'HEIGHT_DESC'}
      ) {
        pageInfo { hasNextPage __typename }
        edges {
          __typename
          cursor
          node {
            id
            anchor
            signature
            recipient
            owner { address key __typename }
            fee { winston ar __typename }
            quantity { winston ar __typename }
            data { size type __typename }
            bundledIn { id __typename }
            tags { name value __typename }
            block {
              id
              timestamp
              height
              previous
              __typename
            }
            __typename
          }
        }
      }
    }`};

    const endpoint: string = `${convertArweaveGateway(this.gateway)}/graphql`;
    const response: Response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(query)
    });

    if (!response.ok)
      throw new Error(await response.text());

    const data: any = await response.json();
    if (data.errors)
      throw new Error(JSON.stringify(data));

    if (this.responseHandler)
      return await this.responseHandler.handle(data);
    else
      return data;
  }
}

export class ArweaveQuery {
  public constructor(
    private readonly gateway: ArweaveGateway = DEFAULT_GATEWAY,
    private readonly responseHandler?: IArweaveResponseHandler
  ) {}

  public metadata(): ArweaveMetadataQueryBuilder {
    return new ArweaveMetadataQueryBuilder(this.gateway, this.responseHandler);
  }

  public data(): ArweaveDataQueryBuilder {
    return new ArweaveDataQueryBuilder(this.gateway);
  }
}