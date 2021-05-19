В задаче будем переводить асинхронный на современный стандарт JavaScript

Для начала поставь все зависимости (`npm i`), запусти сервер командой `npm run server` и открой [localhost:3000](http://localhost:3000)

1. Перепиши в файле `static/focus.js` функцию `sendRequest` так, чтобы она возвращала промис. А в функции `run` жди их при помощи async/await.

2. Перепиши функцию `sendRequest` с использованием `fetch` вместо `XHR`.

3. Измени адрес одного из запросов. Например, вместо `analytics` пусть запрос идет на `analitics`.

Посмотри, что приходит с сервера в этом случае. Посмотри, что содержится в объекте ответа (`response`).

Научись обрабатывать такие ситуации:

- если статус ответа ≥ 300 (поле `ok` в ответе не равно `true`), то выводи алерт с кодом и статусом запроса
- после такой ошибки не должно случиться ничего страшного: код не должен падать и не должен делать новых запросов

4. Сейчас запросы до сервера отправляются последовательно, хотя почти все наши запросы можно делать параллельно. Перепиши функцию `run`, чтобы она использовала `Promise.all`.