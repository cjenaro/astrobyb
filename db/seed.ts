import {
  db,
  DeliveryTime,
  Order,
  Product,
  ProductType,
  User,
  UserType,
} from "astro:db";
import bcrypt from "bcrypt";

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

  const adminHash = bcrypt.hashSync("adminhash", 10);
  const barHash = bcrypt.hashSync("barhash", 10);
  const franchiseHash = bcrypt.hashSync("franchisehash", 10);

  await db.insert(User).values([
    {
      id: 1,
      address: "",
      contact_name: "",
      name: "Jenaro",
      phone_number: "2944323222",
      type_id: 1,
      password_hash: adminHash,
      username: "admin",
    },
    {
      id: 2,
      address: "San Cayetano 4454",
      contact_name: "German Galoppo",
      name: "Bar Example",
      phone_number: "2944323222",
      type_id: 2,
      password_hash: barHash,
      username: "bar",
    },
    {
      id: 3,
      address: "San Lorenzo 501",
      contact_name: "Felipe Torre",
      name: "Franchise Example",
      phone_number: "2944323222",
      type_id: 3,
      password_hash: franchiseHash,
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

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await db.insert(Order).values([
    {
      id: 1,
      date_of_creation: new Date(),
      date_of_delivery: tomorrow,
      user_id: 2,
    },
    {
      id: 2,
      date_of_creation: new Date(),
      date_of_delivery: yesterday,
      user_id: 2,
    },
    {
      id: 3,
      date_of_creation: new Date(),
      date_of_delivery: tomorrow,
      user_id: 2,
    },
  ]);
}
