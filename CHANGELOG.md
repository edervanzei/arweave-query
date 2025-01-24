# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-01-24

### Added

- Creation of CHANGELOG.

### Fixed

- Timeout error in gateway now throws `Error`.

## [1.0.0] - 2025-01-22

### Added

- Fetch data from Arweave in 3 formats: `Buffer`, `string` or `object` (JSON).
- Fetch metadata from Arweave with all possible filters.
- Handler middleware to parse `ArweaveResponse` in any desired format.
   - Users can create and inject custom handlers.