# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.14.1](https://github.com/dvcol/common-utils/compare/v1.14.0...v1.14.1) (2024-08-26)


### Bug Fixes

* **cache:** fix type error in cache store model ([5b889e6](https://github.com/dvcol/common-utils/commit/5b889e6350c5a5aa5ac25e30bbb51ea08bc25df6))

## [1.14.0](https://github.com/dvcol/common-utils/compare/v1.13.1...v1.14.0) (2024-08-26)


### Features

* **cache:** adds access and retention logging toggles ([8d89d00](https://github.com/dvcol/common-utils/commit/8d89d002c34a8674b97406a5fd14792ecd36505e))

### [1.13.1](https://github.com/dvcol/common-utils/compare/v1.13.0...v1.13.1) (2024-08-26)


### Bug Fixes

* **cache:** makes values, keys and entries allow Promise ([f773c03](https://github.com/dvcol/common-utils/commit/f773c038e37647d212e4a52a39bf3389be405009))

## [1.13.0](https://github.com/dvcol/common-utils/compare/v1.12.0...v1.13.0) (2024-08-26)


### Features

* **cache:** adds additional methods to cache store ([c760c6e](https://github.com/dvcol/common-utils/commit/c760c6e526a8f741d94254bb128f1cd08183acac))

## [1.12.0](https://github.com/dvcol/common-utils/compare/v1.11.2...v1.12.0) (2024-08-25)


### Features

* **cache:** adds optional eviction date in cache store entity ([18da2a5](https://github.com/dvcol/common-utils/commit/18da2a57668dd8111db5e72933eb46d34520d4c7))

### [1.11.2](https://github.com/dvcol/common-utils/compare/v1.11.1...v1.11.2) (2024-08-23)


### Bug Fixes

* **format:** round seconds to integers ([913b003](https://github.com/dvcol/common-utils/commit/913b003e5f26a668f65278f21b23d08e2aa109d6))

### [1.11.1](https://github.com/dvcol/common-utils/compare/v1.11.0...v1.11.1) (2024-08-14)


### Bug Fixes

* **format:** adds a days only option to avoid approximation ([e96f414](https://github.com/dvcol/common-utils/commit/e96f414500aaaf156f8bc2df8f0c50b360a0dd1b))

## [1.11.0](https://github.com/dvcol/common-utils/compare/v1.10.0...v1.11.0) (2024-08-14)


### Features

* **format:** adds support to year-month-date in time formatting ([e4f1b77](https://github.com/dvcol/common-utils/commit/e4f1b776f16bee2e81e11c266e7b105bee059305))

## [1.10.0](https://github.com/dvcol/common-utils/compare/v1.9.0...v1.10.0) (2024-08-11)


### Features

* **crypto:** adds crypto utils ([a1ba4a2](https://github.com/dvcol/common-utils/commit/a1ba4a2e594741bec6fafaefc781c7228ef3190a))

## [1.9.0](https://github.com/dvcol/common-utils/compare/v1.8.0...v1.9.0) (2024-08-09)


### Features

* **date:** add a util to get today's date in local iso ([e2e5482](https://github.com/dvcol/common-utils/commit/e2e548231250bae6e3c7d9776c9ea2d5099758f3))

## [1.8.0](https://github.com/dvcol/common-utils/compare/v1.7.0...v1.8.0) (2024-08-09)


### Features

* **date:** adds small day o the week date util ([663ec34](https://github.com/dvcol/common-utils/commit/663ec347f069c23ac50af49f446abb28fa557aad))

## [1.7.0](https://github.com/dvcol/common-utils/compare/v1.6.0...v1.7.0) (2024-08-04)


### Features

* **intl:** creates intl util ([e84f8d1](https://github.com/dvcol/common-utils/commit/e84f8d1ebd0ee22cbd4b15275fbd35cb4759a653))
* **logger:** rework logger and add colorize options ([a6a6c42](https://github.com/dvcol/common-utils/commit/a6a6c427a0c88d6d56a88b87ae74d450619eaf21))
* **navigator:** adds style & navigator utils ([5a1d3ef](https://github.com/dvcol/common-utils/commit/5a1d3ef9fd730d07e9a098fba015e8799460d3c2))
* **promise:** create promise util ([2bb14e2](https://github.com/dvcol/common-utils/commit/2bb14e25af70ce5217fd7f0c7694b89182ae7c1b))

## [1.6.0](https://github.com/dvcol/common-utils/compare/v1.5.0...v1.6.0) (2024-07-22)


### Features

* **window:** adds watch utility for theme modes ([899961b](https://github.com/dvcol/common-utils/commit/899961b15ffe07ef8e6e7c35a91267f6b5010dfb))

## [1.5.0](https://github.com/dvcol/common-utils/compare/v1.4.0...v1.5.0) (2024-07-22)


### Features

* **window:** adds isLightTheme utility function ([bc0f6fd](https://github.com/dvcol/common-utils/commit/bc0f6fd4b8e68915800de71dcfd785d4483b3f31))

## [1.4.0](https://github.com/dvcol/common-utils/compare/v1.3.0...v1.4.0) (2024-07-17)


### Features

* **format:** add formatting utils ([a15eace](https://github.com/dvcol/common-utils/commit/a15eace5658dda342de130ea9975e48d30dd34d8))

## [1.3.0](https://github.com/dvcol/common-utils/compare/v1.2.2...v1.3.0) (2024-07-13)


### Features

* **save:** adds file save utils (mostly chromium browsers) ([a6a3f93](https://github.com/dvcol/common-utils/commit/a6a3f9300f33df8ec401c5cc8bd1da7d75f7bb94))

### [1.2.2](https://github.com/dvcol/common-utils/compare/v1.2.1...v1.2.2) (2024-06-13)


### Bug Fixes

* **build:** exclude specs file from published dist ([3115db7](https://github.com/dvcol/common-utils/commit/3115db722367f2eeaf1b795b67c068ceb8647141))

### [1.2.1](https://github.com/dvcol/common-utils/compare/v1.2.0...v1.2.1) (2024-06-13)


### Bug Fixes

* **http:** add missing export ([aced6d8](https://github.com/dvcol/common-utils/commit/aced6d8e0e5b7a02268f23d5fcbccb18821dac92))

## [1.2.0](https://github.com/dvcol/common-utils/compare/v1.1.0...v1.2.0) (2024-06-13)


### Features

* **logger:** adds static logger ([e8615cd](https://github.com/dvcol/common-utils/commit/e8615cd96c05bd386d185d31f5e3f8d6ae867024))

## 1.1.0 (2024-06-13)


### Features

* initial commit ([ec93ad0](https://github.com/dvcol/common-utils/commit/ec93ad02e5b8e10ab6223259ccdc13bd1cbd9418))
