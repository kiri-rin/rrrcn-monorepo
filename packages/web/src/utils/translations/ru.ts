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
  "geometry.input-at-map": "Отметьте геометрию на карте",
  "data-extraction.title": "Экспорт данных",
  "data-extraction.add-data": "Добавить данные",
  "data-extraction.get-result": "Пуск",
  "data-extraction.add-dates-to-result": "Добавить даты в результат",
  "data-extraction.choose-params": "Добавить параметры",
  "data-extraction.choose-points": "Добавить точки",
  "random-forest.title": "Random forest",
  "random-forest.choose-training-points": "Обучающий набор",
  "random-forest.choose-all-training-points": "Добавить обучающий набор",
  "random-forest.choose-presence": "Добавить точки присутствия",
  "random-forest.choose-absence": "Добавить точки отсутствия",
  "random-forest.choose-region": "Выберите область интереса",
  "random-forest.choose-output-mode": "Выберите способ классификации",
  "random-forest.all-training-points": "В одном наборе",
  "random-forest.separate-training-points": "Раздельные наборы",
  "script-input.scale": "масштаб (scale)",
  "script-input.buffer": "буффер (buffer)",
  "script-input.filename": "Имя фалйа (filename)",
  "population.title": "Оценка численности",
  "population.choose-type": "Способ оценки",
  "population.random-generation": "Генерация случайных точек",
  "population.distance": "Distance",
  "population.density": "Экстраполяция плотности",
  "population.observed-areas": "Обследованные области",
  "population.presence-points": "Точки присутствия",
  "population.presence-area": "Область присутствия",
  "population.use-random-forest": "Использовать результат random forest",
  "population.distance-file": "Файл для distance",
  "population.distance-total-area": "Общая площадь",
  "random-forest.validation": "Валидация",
  "random-forest.validation.split": "Процент разбиения",
  "random-forest.validation.seed": "Случайное зерно",
  "random-forest.validation.split-points": "Разбить обучающий набор",
  "random-forest.choose-validation-points": "Валидационный набор",
  "random-forest.validation.external": "Дополнительный набор",
  "random-forest.validation.cross_validation": "Кросс валидация",
  "random-forest.validation.render_mean": "Вывести среднее",
  "random-forest.validation.render_best": "Вывести лучшее",
};
