import { ProductType, Size, ProductStatus } from "@prisma/client"

type ProductConfig = {
  [key in ProductType]: {
    sizes: Size[];
    label: string;
    hasSize: boolean;
  }
}

export const PRODUCT_TYPE_CONFIG: ProductConfig = {
  TSHIRT: {
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    label: "T-Shirt",
    hasSize: true
  },
  HOODIE: {
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    label: "Hoodie",
    hasSize: true
  },
  HAT: {
    sizes: ["S", "M", "L", "XL"],
    label: "Hat",
    hasSize: true
  },
  STICKER: {
    sizes: ["ONESIZE"],
    label: "Sticker",
    hasSize: false
  },
  MUG: {
    sizes: ["ONESIZE"],
    label: "Mug",
    hasSize: false
  }
} as const

export { ProductType, Size, ProductStatus } 