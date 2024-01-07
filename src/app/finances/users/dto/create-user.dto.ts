export class CreateUserDto {
  id: string
  name: string
  email: string
  password: string
  phone: string
  photo: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}
