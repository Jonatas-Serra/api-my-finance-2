export class CategoriesUtil {
  static defaultCategories = [
    'Alimentação',
    'Transporte',
    'Lazer',
    'Outros',
  ]

  static getDefaultCategories(): string[] {
    return this.defaultCategories
  }
}
