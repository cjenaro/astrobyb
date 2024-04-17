import { defineTable, column, defineDb } from "astro:db";

export const ProductType = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    type: column.text(),
  },
});

export const UserType = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    type: column.text(),
  },
});

export const DeliveryTime = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    time: column.number(),
  },
});

export const User = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    type_id: column.number({ references: () => UserType.columns.id }),
    name: column.text(),
    address: column.text(),
    phone_number: column.text(),
    contact_name: column.text(),
    username: column.text({ unique: true }),
    password_hash: column.text(),
  },
});

export const Product = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    bar_price: column.number(),
    franchise_price: column.number(),
    batch: column.number(),
    delivery_time_id: column.number({
      references: () => DeliveryTime.columns.id,
    }),
    type_id: column.number({ references: () => ProductType.columns.id }),
  },
});

export const OrderItem = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    order_id: column.number({ references: () => Order.columns.id }),
    product_id: column.number({ references: () => Product.columns.id }),
    quantity: column.number(),
  },
});

export const Order = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    user_id: column.number({ references: () => User.columns.id }),
    date_of_creation: column.date(),
    date_of_delivery: column.date(),
  },
});

export default defineDb({
  tables: {
    ProductType,
    UserType,
    DeliveryTime,
    User,
    Product,
    OrderItem,
    Order,
  },
});
