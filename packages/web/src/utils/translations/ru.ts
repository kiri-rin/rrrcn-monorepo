import { getPluralRu } from "./plural/ru";

export const ruTranslations = {
  "common.advanced-settings": "Расширенные настройки",
  "common.dates": "Даты",
  "common.delete": "Удалить",
  "common.edit": "Редактировать",
  "common.clear": "Очистить",
  "common.save": "Сохранить",
  "common.hide": "Скрыть",
  "common.show": "Показать",
  "common.objects-plural": (number: number) =>
    getPluralRu({ number, key: "objects" }),
  "common.close": "Закрыть",
  "data-extraction.title": "Экспорт данных",
  "data-extraction.add-data": "Добавить данные",
  "data-extraction.get-result": "Получить результат",
  "data-extraction.add-dates-to-result": "Добавить даты в результат",
  "data-extraction.choose-params": "Добавитьте параметры",
  "data-extraction.choose-points": "Добавитьте точки",
  "random-forest.title": "Random forest",
  "random-forest.choose-training-points": "Добавьте обучающий набор",
  "random-forest.choose-region": "Выберите область интереса",
  "random-forest.all-training-points": "В одном наборе",
  "random-forest.separate-training-points": "Раздельные наборы",
  "script-input.scale": "масштаб (scale)",
  "script-input.buffer": "буффер (buffer)",
  "script-input.filename": "Имя фалйа (filename)",
};
