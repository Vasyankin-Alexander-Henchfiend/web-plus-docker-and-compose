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

FROM nginx:1.23.1-alpine As production
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx/conf.d  /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]