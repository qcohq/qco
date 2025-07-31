import { protectedProcedure } from "../../trpc";
import { z } from "zod";

export const getTeams = protectedProcedure
  .output(
    z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        plan: z.string(),
        logo: z.string(),
      })
    )
  )
  .query(async () => {
    // В будущем здесь можно добавить запрос к базе данных
    // Пока возвращаем статические данные
    return [
      {
        id: "1",
        name: "ООО Рога и Копыта",
        plan: "Корпоративный",
        logo: "GalleryVerticalEnd",
      },
      {
        id: "2",
        name: "ИП Сидоров",
        plan: "Стартап",
        logo: "AudioWaveform",
      },
      {
        id: "3",
        name: "ЗАО Компания",
        plan: "Бесплатный",
        logo: "Command",
      },
    ];
  }); 
