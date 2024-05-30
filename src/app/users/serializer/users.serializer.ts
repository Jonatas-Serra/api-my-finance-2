import { Exclude, Expose } from 'class-transformer'

export class UsersSerializer {
  @Exclude()
  _id: string

  @Expose()
  name: string

  @Expose()
  email: string

  @Expose()
  phone: string

  @Expose()
  photo: string

  @Exclude()
  password: string

  @Exclude()
  isActive: boolean

  @Expose()
  createdAt: Date

  @Expose()
  updatedAt: Date
}
