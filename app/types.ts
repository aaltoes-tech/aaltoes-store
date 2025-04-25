import { Product, User, Order, OrderItem } from "@prisma/client"
import { ProductType, Size } from "./lib/constants"

export type ProductWithDetails = Omit<Product, 'type' | 'sizes'> & {
  type: ProductType;
  sizes: Size[];
  limited: boolean;
}

export interface OrderWithDetails extends Order {
  user: Pick<User, 'name' | 'email'>;
  items: (OrderItem & {
    product: ProductWithDetails;
  })[];
} 