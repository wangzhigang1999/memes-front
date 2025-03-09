export class ConfigItem {
  key: string;
  value: any;
  description: string;
  visible: boolean;
  visibleName: string;
  type: string;
  min: number | undefined;
  max: number | undefined;

  constructor(key: string, value: any, description: string, visible: boolean, visibleName: string, type: string) {
    this.key = key;
    this.value = value;
    this.description = description;
    this.visible = visible;
    this.visibleName = visibleName;
    this.type = type;
  }
}
