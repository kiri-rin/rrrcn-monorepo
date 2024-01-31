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
  "common.cancel": "Отмена",
  "geometry.input-at-map": "Отметьте геометрию на карте",
  "data-extraction.title": "Экспорт данных",
  "data-extraction.add-data": "Добавить данные",
  "data-extraction.get-result": "Пуск",
  "data-extraction.add-dates-to-result": "Добавить даты в результат",
  "data-extraction.choose-params": "Добавить параметры",
  "data-extraction.choose-points": "Добавить точки",
  "data-extraction.copy-config": "Копировать кофниг",
  "data-extraction.import-config": "Вставить конфиг",
  "random-forest.title": "Random forest",
  "random-forest.choose-training-points": "Обучающий набор",
  "random-forest.choose-all-training-points": "Добавить обучающий набор",
  "random-forest.choose-presence": "Добавить точки присутствия",
  "random-forest.choose-absence": "Добавить точки отсутствия",
  "random-forest.choose-region": "Выберите область интереса",
  "random-forest.choose-output-mode": "Выберите способ классификации",
  "random-forest.all-training-points": "В одном наборе",
  "random-forest.separate-training-points": "Раздельные наборы",
  "random-forest.post-process": "Пост обработка итоговых растров",
  "random-forest.buffersPerAreaPoint":
    "Построить буфферы вокруг дискретных растров",
  "random-forest.classificationSplits": "Вывести срезы растров по процентам",
  "script-input.scale": "масштаб (scale)",
  "script-input.bands": "Слои(bands)",
  "script-input.buffer": "буффер (buffer)",
  "script-input.filename": "Имя фалйа (filename)",
  "population.title": "Оценка численности",
  "population.choose-type": "Способ оценки",
  "population.random-generation": "Генерация случайных точек",
  "population.distance": "Distance",
  "population.density": "Площадочный учет",
  "population.observed-areas": "Обследованные области",
  "population.presence-points": "Точки присутствия",
  "population.presence-area": "Область присутствия",
  "population.cross-validation": "Количество прогонов кросс валидации",
  "population.seed": "Случайное зерно",
  "population.use-random-forest": "Использовать результат random forest",
  "population.distance-file": "Файл для distance",
  "population.distance-function": "Функция плотности",
  "population.density-file": "Файл пдощадок",
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
  "random-forest.validation.use-by-default": "Использовать по умолочанию",
  "random-forest.validation.best": "Лучшее",
  "random-forest.validation.mean": "Среднее",
  "survival.title": "Выживаемость",
  "survival.file": "Файл для MARK",
  "survival.nocc": "Количество дней наблюдений",
  "maxent.title": "Maxent",
  "maxent.background_points": "Фоновые точки",
  "maxent.generate_background_points": "Генерировать фоновые точки",
  "maxent.background_points_count": "Количество фоновых точек",

  "migrations.title": "Миграции",
  "migrations.add-files": "Добавить файлы",
  "migrations.add-migration": "Добавить миграцию",
  "migrations.add-season": "Добавить",
  "migrations.auto-migration": "Разбить на сезоны автоматически",
  "migrations.parse-files": "Загрузить",
  "migrations.winter": "Зима",
  "migrations.autumn": "Осень",
  "migrations.summer": "Лето",
  "migrations.spring": "Весна",
  "migrations.point-index": "Индекс",
  "migrations.point-date": "Дата",
  "migrations.point-altitude": "Высота",
  "migrations.point-info": "Информация с трекера",
  "migrations.selected-migrations": "Выбрано миграций",
  "migrations.generate": "Сгенерировать треки",
  "migrations.generate-count-label": "Количество треков для генерации",
  "migrations.generated-tracks": "Сгенерированные треки",
  "migrations.generated-tracks-total": "Треков",
  "migrations.generated-areas": "Сгенерированные области",
  "migrations.indexed-areas": "Обработанные области",
  "migrations.vulnerability": "Рассчет угроз",
  "migrations.vulnerability-selecred-areas": "Областей для расчета",
  "migrations.vulnerability-config": "Конфиг",
  "migrations.vulnerability-errors-in-config": "Ошибки в конфиге",
  "migrations.vulnerability-run": "Рассчитать угрозы",
  "migrations.area-use-in-vulnerability": "Использовать при рассчете угроз",
  "migrations.area-statistics": "Детальная статистика",
  "migrations.area-index": "Индекс",
  "migrations.area-real-tracks": "Уникальных пролетов",
  "migrations.area-total-tracks": "Сгенерированных треков",
};
