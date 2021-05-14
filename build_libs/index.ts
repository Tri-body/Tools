import { josnToFormat } from "../src/action/toFormat";
import * as dbft from "../src/format/dragonBonesFormat";
import * as object from "../src/common/object";
import format from "../src/action/formatFormat";
import toNew from "../src/action/toNew";

export function db23ToNew(rawSkJson: any, rawTexJson: any): any {
    const dragonBonesData = josnToFormat(rawSkJson, () => {
        const textureAtlas = new dbft.TextureAtlas();
        object.copyObjectFrom(rawTexJson, textureAtlas, dbft.copyConfig);
        return [textureAtlas];
    });
    if (!dragonBonesData) {
        return null;
    }
    toNew(dragonBonesData, false);
    format(dragonBonesData);
    object.compress(dragonBonesData, dbft.compressConfig);
    return dragonBonesData;
}