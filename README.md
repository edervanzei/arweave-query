# ArweaveQuery
An NPM package providing tools for fetching data from the Arweave blockweave, allowing efficient queries for both metadata and raw data.

## Installation
```bash
npm install arweave-query
```

## Import
```js
import { ArweaveQuery } from "arweave-query";
```

## Creating an ArweaveQuery Object
```js
// Using the default gateway (https://arweave.net)
const query = new ArweaveQuery();

// Using a custom gateway
const query = new ArweaveQuery({
  protocol: "https",
  host: "somegateway.com",
  port: 443
});
```

## Fetching Data
```js
// Buffer
const buffer = await query
  .data()
  .buffer("transaction-id");

// Text
const text = await query
  .data()
  .text("transaction-id");

// JSON
const json = await query
  .data()
  .json("transaction-id");
```

## Fetching Metadata
All methods to perform the query:

```js
const result = await query
  .metadata()
  .from("address1", "address2", ...) // Transaction sender
  .to("address1", "address2", ...) // Transaction recipient
  .id("transaction-id-1", "transaction-id-2", ...) // Transaction ID
  .tag("name1", "value1", "value2", ...) // One tag and possible values
  .tag("name2", "value1", "value2", ...) // You can search for more tags
  .first() // Return only one result
  .limit(10) // Or return max 10 results
  .orderBy('asc') // Order by block height ascending
  .orderBy('desc') // Or order by block height descending
  .bundleIn("bundle-id-1", "bundle-id-2", ...) // Bundle ID
  .min(1000) // Block >= 1000
  .max(2000) // Block <= 2000
  .cursor("value") // Cursor
  .get(); // Fetch data
```

## Advanced
By default, the response from the `query.metadata()...get()` method returns the complete Arweave object, but you can customize the way the response is returned to make it easier to manipulate in your code.
To do this, simply create a class that implements `IArweaveResponseHandler` and pass it as a parameter in the `ArweaveQuery` constructor.
```js
class MyHandler implements IArweaveResponseHandler {
  public handle(response: ArweaveResponse): any {
    // manipulate the response and return the new object
  }
}

// DEFAULT_GATEWAY can be imported
const query = new ArweaveQuery(DEFAULT_GATEWAY, new MyHandler());

// BasicArweaveResponseHandler can be imported
const query = new ArweaveQuery(DEFAULT_GATEWAY, new BasicArweaveResponseHandler());

/*
using BasicArweaveResponseHandler all metadata responses will be returned as follows:
[
  {
    id: string,
    owner: string,
    recipient: string,
    fee: string,
    tags: { name: string, value: string }[],
    cursor: string
  }
]
*/
```