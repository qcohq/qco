import { sql } from "drizzle-orm";
import { db } from "../client";

// Объявление типов для Bun
declare global {
  const Bun: {
    spawn: (
      command: string[],
      options?: {
        stdio?: [string, string, string];
        cwd?: string;
      },
    ) => {
      exited: Promise<number>;
    };
  };
}

async function resetDatabase() {
  console.log("🗑️ Начинаю обнуление базы данных...");

  try {
    // Получаем список таблиц из базы данных
    const tablesResult = await db.execute(sql`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
    `);

    const tables = tablesResult.rows.map(
      (row: Record<string, unknown>) => row.tablename as string,
    );

    // Отключаем проверку внешних ключей для удаления таблиц
    await db.execute(sql`SET CONSTRAINTS ALL DEFERRED;`);

    console.log(`📋 Найдено таблиц: ${tables.length}`);

    // Удаляем все таблицы
    for (const table of tables) {
      console.log(`🧹 Удаление таблицы: ${table}`);
      await db.execute(
        sql`DROP TABLE IF EXISTS ${sql.identifier(table)} CASCADE;`,
      );
    }

    // Включаем проверку внешних ключей
    await db.execute(sql`SET CONSTRAINTS ALL IMMEDIATE;`);

    console.log("✅ Все таблицы успешно удалены");

    // Используем drizzle-kit push для создания новой схемы
    console.log("🏗️ Создание новой схемы базы данных...");

    // Запускаем drizzle-kit push с помощью Bun
    console.log("Выполняю команду: drizzle-kit push");

    const proc = Bun.spawn(["drizzle-kit", "push"], {
      stdio: ["inherit", "inherit", "inherit"],
      cwd: process.cwd(),
    });

    const exitCode = await proc.exited;
    if (exitCode !== 0) {
      throw new Error(`drizzle-kit push завершился с кодом ошибки ${exitCode}`);
    }

    console.log("✅ Схема базы данных успешно создана заново");
    console.log("🎉 База данных успешно обнулена и пересоздана");
  } catch (error) {
    console.error("❌ Ошибка при обнулении базы данных:", error);
    process.exit(1);
  }
}

resetDatabase().catch((error) => {
  console.error("❌ Необработанная ошибка:", error);
  process.exit(1);
});
