
type Position = {
  x: number
  y: number
};

class Matrix {
  public constructor(
    public a: number = 1.0, public b: number = 0.0,
    public c: number = 0.0, public d: number = 1.0,
    public tx: number = 0.0, public ty: number = 0.0
  ) {
  }

  public copyFrom(value: Matrix): Matrix {
    this.a = value.a;
    this.b = value.b;
    this.c = value.c;
    this.d = value.d;
    this.tx = value.tx;
    this.ty = value.ty;

    return this;
  }

  public copyFromArray(value: number[], offset: number = 0): Matrix {
    this.a = value[offset];
    this.b = value[offset + 1];
    this.c = value[offset + 2];
    this.d = value[offset + 3];
    this.tx = value[offset + 4];
    this.ty = value[offset + 5];

    return this;
  }

  public identity(): Matrix {
    this.a = this.d = 1.0;
    this.b = this.c = 0.0;
    this.tx = this.ty = 0.0;

    return this;
  }

  public concat(value: Matrix): Matrix {
    let aA = this.a * value.a;
    let bA = 0.0;
    let cA = 0.0;
    let dA = this.d * value.d;
    let txA = this.tx * value.a + value.tx;
    let tyA = this.ty * value.d + value.ty;

    if (this.b !== 0.0 || this.c !== 0.0) {
      aA += this.b * value.c;
      bA += this.b * value.d;
      cA += this.c * value.a;
      dA += this.c * value.b;
    }

    if (value.b !== 0.0 || value.c !== 0.0) {
      bA += this.a * value.b;
      cA += this.d * value.c;
      txA += this.ty * value.c;
      tyA += this.tx * value.b;
    }

    this.a = aA;
    this.b = bA;
    this.c = cA;
    this.d = dA;
    this.tx = txA;
    this.ty = tyA;

    return this;
  }
  public invert(): Matrix {
    let aA = this.a;
    let bA = this.b;
    let cA = this.c;
    let dA = this.d;
    const txA = this.tx;
    const tyA = this.ty;

    if (bA === 0.0 && cA === 0.0) {
      this.b = this.c = 0.0;
      if (aA === 0.0 || dA === 0.0) {
        this.a = this.b = this.tx = this.ty = 0.0;
      } else {
        aA = this.a = 1.0 / aA;
        dA = this.d = 1.0 / dA;
        this.tx = -aA * txA;
        this.ty = -dA * tyA;
      }

      return this;
    }

    let determinant = aA * dA - bA * cA;
    if (determinant === 0.0) {
      this.a = this.d = 1.0;
      this.b = this.c = 0.0;
      this.tx = this.ty = 0.0;

      return this;
    }

    determinant = 1.0 / determinant;
    const k = this.a = dA * determinant;
    bA = this.b = -bA * determinant;
    cA = this.c = -cA * determinant;
    dA = this.d = aA * determinant;
    this.tx = -(k * txA + cA * tyA);
    this.ty = -(bA * txA + dA * tyA);

    return this;
  }

  public transformPoint(x: number, y: number, result: Position, delta: boolean = false): void {
    result.x = this.a * x + this.c * y;
    result.y = this.b * x + this.d * y;

    if (!delta) {
      result.x += this.tx;
      result.y += this.ty;
    }
  }
}

export class DataV23ToV30Util {

  private static readonly ANGLE_TO_RADIAN = Math.PI / 180;
  private static readonly RADIAN_TO_ANGLE = 180 / Math.PI;

  private static readonly VERSION = 'version';
  private static readonly IS_GLOBAL: string = 'isGlobal';
  private static readonly V_23 = '2.3';
  private static readonly V_30 = '3.0';

  private static readonly _helpTransformMatrix = new Matrix();
  private static readonly _helpParentTransformMatrix = new Matrix();

  /**
   *  转换2.3的数据到3.0
   */
  public static convert(dragonBonesData: any): void {
    if (!dragonBonesData || String(dragonBonesData[this.VERSION]) !== this.V_23) {
      return;
    }
    dragonBonesData[this.VERSION] = this.V_30;
    dragonBonesData[this.IS_GLOBAL] = 0;
    const armatures = dragonBonesData.armature as any[];
    if (!armatures) {
      return;
    }
    for (const armatureData of armatures) {
      this.sortArmatureBoneList(armatureData);
      this.transformArmatureData(armatureData);
      this.transformArmatureDataAnimations(armatureData);
    }
  }

  private static transformArmatureData(armatureData: any): void {
    const boneDataList = armatureData.bone as any[];
    if (!boneDataList) {
      return;
    }
    const newBoneDataList = [];
    const length = boneDataList.length;
    let newBoneData: any;
    let parentBoneData: any;
    for (let i = 0; i < length; i++) {
      newBoneData = this.cloneObject(boneDataList[i]);
      if (newBoneData.parent) {
        parentBoneData = this.findBoneData(armatureData, newBoneData.parent);
        if (parentBoneData) {
          this.globalToLocal(newBoneData.transform, parentBoneData.transform);
        }
      }
      newBoneDataList.push(newBoneData);
    }

    boneDataList.length = 0;
    for (newBoneData of newBoneDataList) {
      boneDataList.push(newBoneData);
    }
  }

  private static transformArmatureDataAnimations(armatureData: any): void {
    const animationDataList = armatureData.animation as any[];
    let i = animationDataList ? (animationDataList.length - 1) : -1;
    while (i >= 0) {
      this.transformAnimationData(animationDataList[i], armatureData);
      i--;
    }
  }

  private static sortArmatureBoneList(armatureData: any): void {
    const helpArray = [];
    const boneList = armatureData.bone as any[];
    if (!boneList) {
      return;
    }
    for (const boneData of boneList) {
      let level = 0;
      let parentData = boneData;
      while (parentData) {
        level++;
        parentData = this.findBoneData(armatureData, parentData.parent);
      }
      helpArray.push([level, boneData]);
    }
    helpArray.sort((a: any[], b: any[]) => {
      return b[0] - a[0];
    });
    boneList.length = 0;
    for (const boneData of helpArray) {
      boneList.push(boneData[1]);
    }
  }

  private static transformAnimationData(animationData: any, armatureData: any): void {
    const skinDataList = armatureData.skin as any[];
    let skinData: any;
    if (skinDataList) {
      skinData = skinDataList[0];
    }
    const boneDataList = armatureData.bone as any[];
    if (!boneDataList) {
      return;
    }
    let boneData: any;
    let timelineData: any;
    let frameDataList: any[];
    let frameData: any;
    for (boneData of boneDataList) {
      timelineData = this.findTimelineData(animationData, boneData.name);
      if (!timelineData) {
        continue;
      }
      let position = 0;
      frameDataList = timelineData.frame as any[];
      // 为Timeline中的每个frame计算position.
      if (!frameDataList) {
        continue;
      }
      for (frameData of frameDataList) {
        frameData.global = this.cloneObject(frameData.transform);
        frameData.position = position;
        position += frameData.duration;
      }
      const slotData: any = this.findSlotData(skinData, boneData.name);
      let prevFrameData: any = null;
      for (frameData of frameDataList) {
        // 空帧的情况
        if (frameData.transform == null) {  // tslint:disable-line
          // if (timelineData.pX == null) {
          //   timelineData.pX = 0
          //   timelineData.pY = 0
          // }
          continue;
        }
        this.calculateFrameTransform(animationData, armatureData, boneData, frameData);
        frameData.transform.x -= boneData.transform.x;
        frameData.transform.y -= boneData.transform.y;
        frameData.transform.skX = this.formatAngle(frameData.transform.skX - boneData.transform.skX);
        frameData.transform.skY = this.formatAngle(frameData.transform.skY - boneData.transform.skY);
        frameData.transform.scX /= boneData.transform.scX;
        frameData.transform.scY /= boneData.transform.scY;
        // if (timelineData.pX == null) {
        //   timelineData.pX = frameData.transform.pX
        //   timelineData.pY = frameData.transform.pY
        // }
        // frameData.transform.pX -= timelineData.pX
        // frameData.transform.pY -= timelineData.pY
        if (slotData) {
          frameData.z -= slotData.z;
        }
        if (prevFrameData) {
          const dLX: Number = frameData.transform.skX - prevFrameData.transform.skX;
          if (prevFrameData.tweenRotate) {
            if (prevFrameData.tweenRotate > 0) {
              if (dLX < 0) {
                frameData.transform.skX += 360;
                frameData.transform.skY += 360;
              }
              if (prevFrameData.tweenRotate > 1) {
                frameData.transform.skX += 360 * (prevFrameData.tweenRotate - 1);
                frameData.transform.skY += 360 * (prevFrameData.tweenRotate - 1);
              }
            } else {
              if (dLX > 0) {
                frameData.transform.skX -= 360;
                frameData.transform.skY -= 360;
              }
              if (prevFrameData.tweenRotate < 1) {
                frameData.transform.skX += 360 * (prevFrameData.tweenRotate + 1);
                frameData.transform.skY += 360 * (prevFrameData.tweenRotate + 1);
              }
            }
          } else {
            frameData.transform.skX = prevFrameData.transform.skX
              + this.formatAngle(frameData.transform.skX - prevFrameData.transform.skX);
            frameData.transform.skY = prevFrameData.transform.skY
              + this.formatAngle(frameData.transform.skY - prevFrameData.transform.skY);
          }
        }
        prevFrameData = frameData;
      }
    }
    // 移除没用的数据 frame.global, frame.position
    const timelineDataList = animationData.timeline as any[];
    if (!timelineDataList) {
      return;
    }
    for (timelineData of timelineDataList) {
      frameDataList = timelineData.frame;
      if (!frameDataList) {
        continue;
      }
      for (frameData of frameDataList) {
        delete frameData.position;
        delete frameData.global;
      }
    }
  }

  private static findBoneData(armatureData: any, boneName: string): any {
    if (boneName) {
      const boneDataList = armatureData.bone as any[];
      if (!boneDataList) {
        return null;
      }
      for (const bone of boneDataList) {
        if (bone.name === boneName) {
          return bone;
        }
      }
    }
    return null;
  }

  private static cloneObject(obj: any): any {
    return obj ? JSON.parse(JSON.stringify(obj)) : obj;
  }

  private static globalToLocal(transform: any, parentTransform: any): void {
    this.transformToMatrix(transform, this._helpTransformMatrix, true);
    this.transformToMatrix(parentTransform, this._helpParentTransformMatrix, true);
    this._helpParentTransformMatrix.invert();
    this._helpTransformMatrix.concat(this._helpParentTransformMatrix);
    this.matrixToTransform(this._helpTransformMatrix, transform, transform.scX * parentTransform.scX >= 0,
      transform.scY * parentTransform.scY >= 0);
  }

  private static transformToMatrix(transform: any, matrix: Matrix, keepScale: boolean = false): void {
    if (keepScale) {
      matrix.a = transform.scX * Math.cos(transform.skY * this.ANGLE_TO_RADIAN);
      matrix.b = transform.scX * Math.sin(transform.skY * this.ANGLE_TO_RADIAN);
      matrix.c = -transform.scY * Math.sin(transform.skX * this.ANGLE_TO_RADIAN);
      matrix.d = transform.scY * Math.cos(transform.skX * this.ANGLE_TO_RADIAN);
      matrix.tx = transform.x;
      matrix.ty = transform.y;
    } else {
      matrix.a = Math.cos(transform.skY * this.ANGLE_TO_RADIAN);
      matrix.b = Math.sin(transform.skY * this.ANGLE_TO_RADIAN);
      matrix.c = -Math.sin(transform.skX * this.ANGLE_TO_RADIAN);
      matrix.d = Math.cos(transform.skX * this.ANGLE_TO_RADIAN);
      matrix.tx = transform.x;
      matrix.ty = transform.y;
    }
  }

  private static matrixToTransform(matrix: Matrix, transform: any, scaleXF: boolean, scaleYF: boolean): void {
    transform.x = matrix.tx;
    transform.y = matrix.ty;
    transform.scX = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b) * (scaleXF ? 1 : -1);
    transform.scY = Math.sqrt(matrix.d * matrix.d + matrix.c * matrix.c) * (scaleYF ? 1 : -1);
    const skewXArray = [];
    skewXArray[0] = Math.acos(matrix.d / transform.scY);
    skewXArray[1] = -skewXArray[0];
    skewXArray[2] = Math.asin(-matrix.c / transform.scY);
    skewXArray[3] = skewXArray[2] >= 0 ? Math.PI - skewXArray[2] : skewXArray[2] - Math.PI;
    if (Number(skewXArray[0]).toFixed(4) === Number(skewXArray[2]).toFixed(4)
      || Number(skewXArray[0]).toFixed(4) === Number(skewXArray[3]).toFixed(4)) {
      transform.skX = skewXArray[0];
    } else {
      transform.skX = skewXArray[1];
    }
    const skewYArray = [];
    skewYArray[0] = Math.acos(matrix.a / transform.scX);
    skewYArray[1] = -skewYArray[0];
    skewYArray[2] = Math.asin(matrix.b / transform.scX);
    skewYArray[3] = skewYArray[2] >= 0 ? Math.PI - skewYArray[2] : skewYArray[2] - Math.PI;
    if (Number(skewYArray[0]).toFixed(4) === Number(skewYArray[2]).toFixed(4)
      || Number(skewYArray[0]).toFixed(4) === Number(skewYArray[3]).toFixed(4)) {
      transform.skY = skewYArray[0];
    } else {
      transform.skY = skewYArray[1];
    }
    transform.skX *= this.RADIAN_TO_ANGLE;
    transform.skY *= this.RADIAN_TO_ANGLE;
  }

  private static findTimelineData(animationData: any, boneName: string): any {
    if (animationData && boneName) {
      const timelineList = animationData.timeline as any[];
      if (!timelineList) {
        return null;
      }
      for (const timeline of timelineList) {
        if (timeline.name === boneName) {
          return timeline;
        }
      }
    }
    return null;
  }

  private static findSlotData(skinData: any, boneName: string): any {
    if (skinData && boneName) {
      const slotList = skinData.slot as any[];
      if (!slotList) {
        return null;
      }
      for (const slot of slotList) {
        if (slot.name === boneName) {
          return slot;
        }
      }
    }
    return null;
  }

  // 计算相对父节点的相对Transform
  private static calculateFrameTransform(animationData: any, armatureData: any, boneData: any, frameData: any): void {
    let parentBoneData = this.findBoneData(armatureData, boneData.parent);
    if (parentBoneData) {
      let parentTimelineData: any = this.findTimelineData(animationData, parentBoneData.name);
      if (parentTimelineData) {
        const parentTimelineDataList = [];
        const parentBoneDataList = [];
        // 构建父骨头列表以及对应的etimeline列表
        while (parentTimelineData) {
          parentTimelineDataList.push(parentTimelineData);
          parentBoneDataList.push(parentBoneData);
          parentBoneData = this.findBoneData(armatureData, parentBoneData.parent);
          if (parentBoneData) {
            parentTimelineData = this.findTimelineData(animationData, parentBoneData.name);
          } else {
            parentTimelineData = null;
          }
        }
        let globalTransform: any;
        const globalTransformMatrix: Matrix = new Matrix();
        const currentTransform: any = {};
        const currentTransformMatrix: Matrix = new Matrix();
        // 从根开始遍历
        let i = parentTimelineDataList.length - 1;
        while (i >= 0) {
          parentTimelineData = parentTimelineDataList[i];
          parentBoneData = parentBoneDataList[i];
          // 一级一级找到当前帧对应的每个父节点的transform(相对transform) 保存到currentTransform，globalTransform保存根节点的transform
          this.calculateTimelineTransform(parentTimelineData, frameData.position,
            currentTransform, !globalTransform);

          if (!globalTransform) {
            globalTransform = {};
            this.copyTransform(currentTransform, globalTransform);
          } else {
            currentTransform.x += parentBoneData.transform.x;
            currentTransform.y += parentBoneData.transform.y;
            currentTransform.skX += parentBoneData.transform.skX;
            currentTransform.skY += parentBoneData.transform.skY;
            currentTransform.scX *= parentBoneData.transform.scX;
            currentTransform.scY *= parentBoneData.transform.scY;
            this.transformToMatrix(currentTransform, currentTransformMatrix, true);
            currentTransformMatrix.concat(globalTransformMatrix);
            this.matrixToTransform(currentTransformMatrix, globalTransform,
              currentTransform.scX * globalTransform.scX >= 0,
              currentTransform.scY * globalTransform.scY >= 0);
          }
          this.transformToMatrix(globalTransform, globalTransformMatrix, true);
          i--;
        }
        this.globalToLocal(frameData.transform, globalTransform);
      }
    }
  }

  private static calculateTimelineTransform(timelineData: any, position: number, outputTransform: any, isRoot: boolean): void {

    const frameDataList = timelineData.frame as any[];
    let i = frameDataList ? (frameDataList.length - 1) : -1;
    while (i >= 0) {
      const currentFrameData = frameDataList[i];
      // 找到穿越当前帧的关键帧
      if (currentFrameData.position <= position
        && currentFrameData.position + currentFrameData.duration > position) {
        // 是最后一帧或者就是当前帧
        if (i === frameDataList.length - 1 || position === currentFrameData.position) {
          const targetTransform: any = isRoot ? currentFrameData.global : currentFrameData.transform;
          this.copyTransform(targetTransform, outputTransform);
        } else {
          const tweenEasing: number = currentFrameData.tweenEasing;
          let progress: number = (position - currentFrameData.position) / currentFrameData.duration;
          if (tweenEasing && tweenEasing !== 10) {
            progress = this.getEaseValue(progress, tweenEasing);
          }
          const nextFrameData = frameDataList[i + 1];
          const currentTransform = isRoot ? currentFrameData.global : currentFrameData.transform;
          const nextTransform = isRoot ? nextFrameData.global : nextFrameData.transform;
          outputTransform.x = currentTransform.x + (nextTransform.x - currentTransform.x) * progress;
          outputTransform.y = currentTransform.y + (nextTransform.y - currentTransform.y) * progress;
          outputTransform.skX = this.formatAngle(
            currentTransform.skX + (nextTransform.skX - currentTransform.skX) * progress);
          outputTransform.skY = this.formatAngle(
            currentTransform.skY + (nextTransform.skY - currentTransform.skY) * progress);
          outputTransform.scX =
            currentTransform.scX + (nextTransform.scX - currentTransform.scX) * progress;
          outputTransform.scY =
            currentTransform.scY + (nextTransform.scY - currentTransform.scY) * progress;
        }
        break;
      }
      i--;
    }
  }

  private static copyTransform(sourceTransform: any, targetTransform: any): void {
    targetTransform.x = sourceTransform.x;
    targetTransform.y = sourceTransform.y;
    targetTransform.skX = sourceTransform.skX;
    targetTransform.skY = sourceTransform.skY;
    targetTransform.scX = sourceTransform.scX;
    targetTransform.scY = sourceTransform.scY;
  }

  private static getEaseValue(value: number, easing: number): number {
    let valueEase = 1;
    if (easing > 1) {
      valueEase = 0.5 * (1 - Math.cos(value * Math.PI));
      easing -= 1;
    } else if (easing > 0) {
      valueEase = 1 - Math.pow(1 - value, 2);
    } else if (easing < 0) {
      easing *= -1;
      valueEase = Math.pow(value, 2);
    }
    return (valueEase - value) * easing + value;
  }

  private static formatAngle(angle: number): number {
    angle %= 360;
    if (angle > 180) {
      angle -= 360;
    } else if (angle < -180) {
      angle += 360;
    }
    return angle;
  }

}