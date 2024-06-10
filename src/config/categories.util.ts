export class CategoriesUtil {
  static defaultCategories = [
    'Alimentação',
    'Moradia',
    'Transporte',
    'Saúde',
    'Educação',
    'Lazer',
    'Renda Extra',
    'Despesas Pessoais',
    'Finanças',
    'Pet',
  ]

  static getDefaultCategories(): string[] {
    return this.defaultCategories
  }
}
