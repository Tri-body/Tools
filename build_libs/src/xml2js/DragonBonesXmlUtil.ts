import { DataV23ToV30Util } from './DataV23ToV30Util';
import X2JS from 'x2js';

class DragonBonesConstValues {

  public static readonly DRAGON_BONES: string = 'dragonBones';
  public static readonly ARMATURE: string = 'armature';
  public static readonly SKIN: string = 'skin';
  public static readonly BONE: string = 'bone';
  public static readonly SLOT: string = 'slot';
  public static readonly DISPLAY: string = 'display';
  public static readonly ANIMATION: string = 'animation';
  public static readonly TIMELINE: string = 'timeline';
  public static readonly FRAME: string = 'frame';
  public static readonly TRANSFORM: string = 'transform';
  public static readonly COLOR_TRANSFORM: string = 'colorTransform';
  public static readonly RECTANGLE: string = 'rectangle';
  public static readonly ELLIPSE: string = 'ellipse';

  public static readonly TEXTURE_ATLAS: string = 'TextureAtlas';
  public static readonly SUB_TEXTURE: string = 'SubTexture';

  public static readonly A_ROTATED: string = 'rotated';
  public static readonly A_FRAME_X: string = 'frameX';
  public static readonly A_FRAME_Y: string = 'frameY';
  public static readonly A_FRAME_WIDTH: string = 'frameWidth';
  public static readonly A_FRAME_HEIGHT: string = 'frameHeight';

  public static readonly A_IMAGE_PATH: string = 'imagePath';
  public static readonly A_FRAME_RATE: string = 'frameRate';
  public static readonly A_NAME: string = 'name';

  public static readonly A_PARENT: string = 'parent';
  public static readonly A_LENGTH: string = 'length';
  public static readonly A_TYPE: string = 'type';
  public static readonly A_FADE_IN_TIME: string = 'fadeInTime';
  public static readonly A_DURATION: string = 'duration';
  public static readonly A_SCALE: string = 'scale';
  public static readonly A_OFFSET: string = 'offset';
  public static readonly A_LOOP: string = 'loop';
  public static readonly A_EVENT: string = 'event';
  public static readonly A_EVENT_PARAMETERS: string = 'eventParameters';
  public static readonly A_SOUND: string = 'sound';
  public static readonly A_ACTION: string = 'action';
  public static readonly A_HIDE: string = 'hide';
  public static readonly A_AUTO_TWEEN: string = 'autoTween';
  public static readonly A_TWEEN_EASING: string = 'tweenEasing';
  public static readonly A_TWEEN_ROTATE: string = 'tweenRotate';
  public static readonly A_TWEEN_SCALE: string = 'tweenScale';
  public static readonly A_DISPLAY_INDEX: string = 'displayIndex';
  public static readonly A_Z_ORDER: string = 'z';
  public static readonly A_BLENDMODE: string = 'blendMode';
  public static readonly A_WIDTH: string = 'width';
  public static readonly A_HEIGHT: string = 'height';
  public static readonly A_INHERIT_SCALE: string = 'inheritScale';
  public static readonly A_INHERIT_ROTATION: string = 'inheritRotation';
  public static readonly A_X: string = 'x';
  public static readonly A_Y: string = 'y';
  public static readonly A_SKEW_X: string = 'skX';
  public static readonly A_SKEW_Y: string = 'skY';
  public static readonly A_SCALE_X: string = 'scX';
  public static readonly A_SCALE_Y: string = 'scY';
  public static readonly A_PIVOT_X: string = 'pX';
  public static readonly A_PIVOT_Y: string = 'pY';
  public static readonly A_ALPHA_OFFSET: string = 'aO';
  public static readonly A_RED_OFFSET: string = 'rO';
  public static readonly A_GREEN_OFFSET: string = 'gO';
  public static readonly A_BLUE_OFFSET: string = 'bO';
  public static readonly A_ALPHA_MULTIPLIER: string = 'aM';
  public static readonly A_RED_MULTIPLIER: string = 'rM';
  public static readonly A_GREEN_MULTIPLIER: string = 'gM';
  public static readonly A_BLUE_MULTIPLIER: string = 'bM';

  public static readonly A_SCALE_X_OFFSET: string = 'scXOffset';
  public static readonly A_SCALE_Y_OFFSET: string = 'scYOffset';

  public static readonly A_SCALE_MODE: string = 'scaleMode';
  public static readonly A_FIXED_ROTATION: string = 'fixedRotation';

  public static readonly DATA_XML_LIST_NAMES: Array<string> = [
    DragonBonesConstValues.ARMATURE,
    DragonBonesConstValues.BONE,
    DragonBonesConstValues.SKIN,
    DragonBonesConstValues.SLOT,
    DragonBonesConstValues.DISPLAY,
    DragonBonesConstValues.ANIMATION,
    DragonBonesConstValues.TIMELINE,
    DragonBonesConstValues.FRAME,
    DragonBonesConstValues.ELLIPSE,
    DragonBonesConstValues.RECTANGLE
  ];

  public static readonly PNG_XML_LIST_NAMES: Array<string> = [
    DragonBonesConstValues.SUB_TEXTURE
  ];

}

class DragonBonesOptimizeDataUtils {
  private static readonly animationPropertyArray: string[] = [
    DragonBonesConstValues.A_FADE_IN_TIME,
    DragonBonesConstValues.A_SCALE,
    DragonBonesConstValues.A_LOOP
  ];
  private static readonly animationValueArray: number[] = [0, 1, 1];

  private static readonly timelinePropertyArray: string[] = [
    DragonBonesConstValues.A_SCALE,
    DragonBonesConstValues.A_OFFSET,
    DragonBonesConstValues.A_PIVOT_X,
    DragonBonesConstValues.A_PIVOT_Y
  ];
  private static readonly timelineValueArray: number[] = [1, 0, 0, 0];

  private static readonly framePropertyArray: string[] = [
    DragonBonesConstValues.A_TWEEN_SCALE,
    DragonBonesConstValues.A_TWEEN_ROTATE,
    DragonBonesConstValues.A_HIDE,
    DragonBonesConstValues.A_DISPLAY_INDEX,
    DragonBonesConstValues.A_SCALE_X_OFFSET,
    DragonBonesConstValues.A_SCALE_Y_OFFSET
  ];
  private static readonly frameValueArray: number[] = [1, 0, 0, 0, 0, 0];

  private static readonly transformPropertyArray: string[] = [
    DragonBonesConstValues.A_X,
    DragonBonesConstValues.A_Y,
    DragonBonesConstValues.A_SKEW_X,
    DragonBonesConstValues.A_SKEW_Y,
    DragonBonesConstValues.A_SCALE_X,
    DragonBonesConstValues.A_SCALE_Y,
    DragonBonesConstValues.A_PIVOT_X,
    DragonBonesConstValues.A_PIVOT_Y];

  private static readonly transformValueArray: number[] = [0, 0, 0, 0, 1, 1, 0, 0];

  private static readonly colorTransformPropertyArray: string[] = [
    DragonBonesConstValues.A_ALPHA_OFFSET,
    DragonBonesConstValues.A_RED_OFFSET,
    DragonBonesConstValues.A_GREEN_OFFSET,
    DragonBonesConstValues.A_BLUE_OFFSET,
    DragonBonesConstValues.A_ALPHA_MULTIPLIER,
    DragonBonesConstValues.A_RED_MULTIPLIER,
    DragonBonesConstValues.A_GREEN_MULTIPLIER,
    DragonBonesConstValues.A_BLUE_MULTIPLIER
  ];
  private static readonly colorTransformValueArray: number[] = [0, 0, 0, 0, 100, 100, 100, 100];

  public static optimizeData(dragonBonesData: any): void {
    let boneDataList: any[];
    for (const armatureData of dragonBonesData.armature) {
      boneDataList = armatureData.bone;
      if (!boneDataList) continue;
      for (const boneData of boneDataList) {
        this.optimizeTransform(boneData.transform);
      }

      const skinList: any[] = armatureData.skin;
      let slotList: any[];
      let displayList: any[];
      if (!skinList) continue;
      for (const skinData of skinList) {
        slotList = skinData.slot;
        if (!slotList) continue;
        for (const slotData of slotList) {
          displayList = slotData.display;
          if (!displayList) continue;
          for (const displayData of displayList) {
            this.optimizeTransform(displayData.transform);
          }
        }
      }

      const animationList: any[] = armatureData.animation;
      let timelineList: any[];
      let frameList: any[];
      for (const animationData of animationList) {
        this.optimizeAnimation(animationData);
        timelineList = animationData.timeline;
        if (!timelineList) continue;
        for (const timelineData of timelineList) {
          this.optimizeTimeline(timelineData);
          frameList = timelineData.frame;
          if (!frameList) continue;
          for (const frameData of frameList) {
            this.optimizeFrame(frameData);
            this.optimizeTransform(frameData.transform);
            this.optimizeColorTransform(frameData.colorTransform);
          }
        }
      }
    }
  }

  private static optimizeAnimation(animationData: any): void {
    this.optimizeItem(animationData, this.animationPropertyArray, this.animationValueArray, 4);
  }

  private static optimizeTimeline(timelineData: any): void {
    this.optimizeItem(timelineData, this.timelinePropertyArray, this.timelineValueArray, 4);
  }

  private static optimizeFrame(frameData: any): void {
    this.optimizeItem(frameData, this.framePropertyArray, this.frameValueArray, 4);
  }

  private static optimizeTransform(transform: any): void {
    this.optimizeItem(transform, this.transformPropertyArray, this.transformValueArray, 4);
  }

  private static optimizeColorTransform(colorTransform: any): void {
    this.optimizeItem(colorTransform, this.transformPropertyArray, this.transformValueArray, 4);
  }

  private static optimizeItem(item: any, propertyArray: any[], valueArray: any[], prec: number = 4): void {
    if (!item) {
      return;
    }

    let i: number = propertyArray.length;
    let property: string;
    let value: number;
    while (i--) {
      property = propertyArray[i];
      value = valueArray[i];
      if (!item.hasOwnProperty(property)) {
        continue;
      }
      if (this.compareWith(item[property], value, prec)) {
        delete item[property];
      } else {
        item[property] = Number(Number(item[property]).toFixed(prec));
      }
    }
  }

  private static compareWith(source: number, target: number, prec: number): boolean {
    const delta: number = 1 / Math.pow(10, prec);
    if (source >= target - delta && source <= target + delta) {
      return true;
    }
    return false;
  }
}

export class DragonBonesXmlUtil {

  private static _parser: X2JS;

  // number, boolean 转换器
  private static readonly attributeConverters = [
    {
      // 叫"name"和“parent”的属性的值不是number类型
      test: (name: string, value: any): any => {
        return name !== DragonBonesConstValues.A_NAME
          && name !== DragonBonesConstValues.A_PARENT
          && (name === DragonBonesConstValues.A_TWEEN_EASING || !isNaN(value));
      },
      convert: (name: string, value: any): any => {
        return Number(value);
      }
    },
    {
      test: (name: string, value: any): any => {
        return /^(?:true|false)$/i.test(value);
      },
      convert: (name: string, value: any): any => {
        return value.toLowerCase() === 'true';
      }
    }
  ];

  public static parseXmlStrToJson(xmlStr: string, toV3: boolean = false, optimize: boolean = false): any {
    if (!xmlStr) {
      return null;
    }
    if (!DragonBonesXmlUtil._parser) {
      DragonBonesXmlUtil._parser = new X2JS({
        attributePrefix: '',
        ignoreRoot: true,
        attributeConverters: DragonBonesXmlUtil.attributeConverters,
        emptyNodeForm: 'object'
      });
    }
    const result = DragonBonesXmlUtil._parser.xml2js<any>(xmlStr);
    if (result.hasOwnProperty('armature')) {
      DragonBonesXmlUtil.convertListObjToArray(result, DragonBonesConstValues.DATA_XML_LIST_NAMES); // 特殊字段转数组类型
      if (toV3) {
        DataV23ToV30Util.convert(result);   // 数据v2.3转v3.0
      }
      if (optimize) {
        DragonBonesOptimizeDataUtils.optimizeData(result);  // 压缩数据
      }
    } else {
      DragonBonesXmlUtil.convertListObjToArray(result, DragonBonesConstValues.PNG_XML_LIST_NAMES);
    }
    return result;
  }

  private static convertListObjToArray(obj: any, listNames: Array<string>): void {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (!(obj[key] instanceof Array) && listNames.indexOf(key) !== -1) {
            obj[key] = [obj[key]];
          }
          DragonBonesXmlUtil.convertListObjToArray(obj[key], listNames);
        }
      }
    }
  }
}