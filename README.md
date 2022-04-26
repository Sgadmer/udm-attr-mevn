# UDM-ATR-MEVN

## Доки по Nuxt3

1) [Основа](https://v3.nuxtjs.org/guide/concepts/introduction)
2) [API](https://v3.nuxtjs.org/api/composables/use-async-data)
3) [Config](https://v3.nuxtjs.org/api/configuration/nuxt.config)

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

Запустить собранный прод билд:

```bash
yarn preview
```

По умолчанию проект собирается для node серверов [Доки под сборку проекта под разные серверы](https://v3.nuxtjs.org/guide/deploy/presets)
