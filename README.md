# UDM-ATR-MEVN

## Полезные ссылки

1) [Nuxt3 Основы](https://v3.nuxtjs.org/guide/concepts/introduction)
2) [Nuxt3 API](https://v3.nuxtjs.org/api/composables/use-async-data)
3) [Nuxt3 Config](https://v3.nuxtjs.org/api/configuration/nuxt.config)
4) [Vue3 TypeScript with Composition API](https://vuejs.org/guide/typescript/composition-api.html)
5) [Mongoose Crush Course](https://www.youtube.com/watch?v=DZBGEVgL2eE&t=201s) (YouTube)
6) [Mongoose Docs](https://mongoosejs.com/docs/guides.html)
7) [Postman](https://www.postman.com/)
8) [Compass](https://www.mongodb.com/try/download/compass) (Позволяет отслеживать изменеия в MongoDB)

## Подготовка

Используемые версии Node и Yarn:

```bash
# Node (nvm)
16.14.2

# Yarn
1.22.5
```

## Установка

Установите зависимости через yarn:

```bash
yarn install
```

## Dev Сервер

Сервер запуститься на http://localhost:3000 (если не указан другой порт)

```bash
yarn dev
```

## Production

Сборка приложения для прода :

```bash
# Фронт и бэк собираются одной командой в один проект
# ИСПОЛЬЗОВАТЬ ЭТО
yarn build
```

```bash
# The generate command pre-renders every route of your application 
# and stores the result in plain HTML files that you can deploy 
# on any static hosting services. 
# The command triggers the nuxi build command with the prerender 
# argument set to true

# __НЕ__ИСПОЛЬЗОВАТЬ ЭТО
yarn generate
```

## Production preview

Сервер запуститься на http://localhost:4000 (если не указан другой порт)
Здесь можно посмотреть все ли в порядке с билдом
При отправке на сервер хост и порт будут автоматом заменены на те что в env сервера

```bash
yarn preview
```

По умолчанию проект собирается для node серверов [Доки под сборку проекта под разные серверы](https://v3.nuxtjs.org/guide/deploy/presets)
