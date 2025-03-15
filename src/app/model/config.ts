interface Constraints {
  [key: string]: any
}

enum Type {
  STRING = 'STRING',
  INTEGER = 'INTEGER',
  BOOLEAN = 'BOOLEAN',
  DOUBLE = 'DOUBLE',
  JSON = 'JSON',
}

export class Config {
  id?: number
  configKey: string
  value: string
  description: string
  visible: boolean
  visibleName: string
  type: Type
  constraints: Constraints

  constructor(
    id: number | undefined,
    configKey: string,
    value: string,
    description: string,
    visible: boolean,
    visibleName: string,
    type: Type,
    constraints: Constraints
  ) {
    this.id = id
    this.configKey = configKey
    this.value = value
    this.description = description
    this.visible = visible
    this.visibleName = visibleName
    this.type = type
    this.constraints = constraints
  }
}
