
## QuickStart

### Development

```bash
$ yarn
$ yarn run local
$ 前端项目访问    http://localhost:8080/
$ 后端接口启动端口 http://localhost:8003/
```

Don't tsc compile at development mode, if you had run `tsc` then you need to `npm run clean` before `npm run dev`.

### Deploy

```bash
$ yarn run tsc
$ yarn run start
```

### Npm Scripts

- Use `npm run lint` to check code style
- Use `npm test` to run unit test
- se `npm run clean` to clean compiled js at development mode once

### Requirement

- Node.js 8.11.1
- Typescript 2.8+
