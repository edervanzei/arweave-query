import { ArweaveGateway } from './models';

export function convertArweaveGateway(gateway: ArweaveGateway): string {
  return `${gateway.protocol}://${gateway.host}:${gateway.port}`;
}