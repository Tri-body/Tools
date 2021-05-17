# dragonbones-converter

> a library for convert dragonbones data from old version(2.3) to new version(5.6)

##### build

```sh
npm install
npm run build
```

##### useage

```js
// npm i -S dragonbones-converter

import { DragonBonesXmlUtil, dbToNew } from 'dbconverter'

oldSkeletonJson = DragonBonesXmlUtil.parseXmlStrToJson(oldSkeletonXmlStr); // old sk data xml to json
textureJson = DragonBonesXmlUtil.parseXmlStrToJson(textureXmlStr); // tex xml to json

newSkeletonJson = dbToNew(oldSkeletonJson, textureJson); // old data to latest version data

```



