# Оптимальный вариант - multi-stage сборка
# так в продакшн-контейнере не окажется лишних зависимостей и TS-исходников

# Задаем базовый образ для этапа сборки
FROM node:16-alpine as builder
# Задаем рабочую директорию
WORKDIR /app
# Копируем список зависимостей и лок-файл отдельно от файлов проекта
# напомним, это нужно для кэширования установки зависимостей
COPY package*.json ./
# Устанавливаем зависимости 
RUN npm i
COPY . .
RUN npm run build

FROM node:16-alpine As production
WORKDIR /app
COPY package*.json ./
# Флаг --omit=dev означает "не ставить dev-зависимости"
RUN npm i --omit=dev
COPY . .
# Копируем результат сборки из build-стадии
COPY --from=builder /app/build ./build
EXPOSE 3000
# Команда для запуска
CMD ["npm", "run", "start"]