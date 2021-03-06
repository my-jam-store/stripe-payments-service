# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Enable all CORS requests.
- Airtable bulk actions records chunking.
- Cart customer details save feature.
- Stripe Payment Intent customer creation.
- Subtotal free shipping.

### Changed
- Rename project.
- Stringify the logged JSON data.

### Fixed
- Update Stripe Payment Intent shipping amount metadata when cart gets updated.

### Removed
- Remove time fields in cart to order items mapping.

## [0.1.0] - 2020-06-06
### Added
- Initial release.

[Unreleased]: https://github.com/my-jam-store/stripe-payments-server/compare/0.1.0...HEAD
[0.1.0]: https://github.com/my-jam-store/stripe-payments-server/releases/tag/0.1.0
