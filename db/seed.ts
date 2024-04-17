import {
  db,
  DeliveryTime,
  Product,
  ProductType,
  User,
  UserType,
} from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(ProductType).values([
    {
      id: 1,
      type: "postre",
    },
    {
      id: 2,
      type: "torta",
    },
    {
      id: 3,
      type: "tarta",
    },
    {
      id: 4,
      type: "individual",
    },
  ]);

  await db.insert(UserType).values([
    {
      id: 1,
      type: "admin",
    },
    {
      id: 2,
      type: "bar",
    },
    {
      id: 3,
      type: "franchise",
    },
  ]);

  await db.insert(DeliveryTime).values([
    {
      id: 1,
      time: 24,
    },
    {
      id: 2,
      time: 48,
    },
  ]);

  await db.insert(User).values([
    {
      id: 1,
      address: "",
      contact_name: "",
      name: "Jenaro",
      phone_number: "2944323222",
      type_id: 1,
      password_hash: "adminhash",
      username: "admin",
    },
    {
      id: 2,
      address: "San Cayetano 4454",
      contact_name: "German Galoppo",
      name: "Bar Example",
      phone_number: "2944323222",
      type_id: 2,
      password_hash: "barhash",
      username: "bar",
    },
    {
      id: 3,
      address: "San Lorenzo 501",
      contact_name: "Felipe Torre",
      name: "Franchise Example",
      phone_number: "2944323222",
      type_id: 3,
      password_hash: "franchisehash",
      username: "franchise",
    },
  ]);

  await db.insert(Product).values([
    {
      id: 1,
      batch: 1,
      bar_price: 100,
      franchise_price: 98,
      delivery_time_id: 1,
      name: "Marquisse",
      type_id: 2,
    },
    {
      id: 2,
      batch: 10,
      bar_price: 110,
      franchise_price: 100,
      delivery_time_id: 1,
      name: "Alfajores",
      type_id: 4,
    },
    {
      id: 3,
      batch: 1,
      bar_price: 100,
      franchise_price: 98,
      delivery_time_id: 1,
      name: "Lemon Pie",
      type_id: 3,
    },
    {
      id: 4,
      batch: 1,
      bar_price: 100,
      franchise_price: 98,
      delivery_time_id: 1,
      name: "Postre",
      type_id: 1,
    },
  ]);
}
