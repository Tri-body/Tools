# dragonbones-converter

> a library for convert dragonbones data from old version(2.3) to new version(5.6)

##### build

```sh
npm install
npm run build
```

##### typings

```sh
typings
├── dbconverter.d.ts     # for es module project
└── egret
    └── dbconverter.d.ts # for egret namespace project
```

##### useage

```js
import { dbToNew } from 'dbconverter'

newSkeletonJson = dbToNew(oldSkeletonJson, textureJson);

```



