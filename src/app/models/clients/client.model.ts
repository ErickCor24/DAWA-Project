
export interface Client {
  id?: number // Cambiado a number para coincidir con el backend
  fullName: string
  email: string
  password?: string 
  phoneNumber: string // Cambiado para coincidir con el backend
  ci: string
  address?: string
  birthDate: string
  nationality: string
  status: boolean
}

