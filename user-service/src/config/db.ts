import * as SequelizeModule from "sequelize";
const { Sequelize } = SequelizeModule as any;
import { env } from "./env";

const isProduction = env.NODE_ENV === "production";

const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: "postgres",
  logging: isProduction ? false : console.log,
  dialectOptions: isProduction
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
});

export const connectDB = async () => {
  let attempts = 0;
  const maxAttempts = 5;
  let connected = false;

  while (!connected && attempts < maxAttempts) {
    try {
      await sequelize.authenticate();
      console.log("✅ PostgreSQL Connected (User Service)");
      connected = true;

      // Sync schema (Disabled for migrations)
      // await sequelize.sync({ alter: true });
    } catch (err) {
      attempts++;
      console.error(`❌ DB Connection failed (Attempt ${attempts}/${maxAttempts}):`, err);
      if (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else {
        process.exit(1);
      }
    }
  }
};

export default sequelize;
