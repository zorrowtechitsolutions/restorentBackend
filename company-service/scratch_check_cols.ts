import sequelize from "./src/config/db";

async function checkCols() {
  try {
    const [results] = await sequelize.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'notifications'");
    console.log("Actual Columns in notifications table:", results.map((r: any) => r.column_name));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkCols();
