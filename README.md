# dzd-mouseclinic-client

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
cd app/
yarn install
```

### Compile and Hot-Reload for Development

```sh
cd app/
yarn run dev
```

### Compile and Minify for Production

```sh
cd app/
yarn run build
```
## Run Project

### Via prebuild docker image

```bash
docker run -p 80:80 registry-gl.connect.dzd-ev.de:443/dzdapps/dzd-werk:latest
```

### Via local build image

```bash
git clone ssh://git@git.connect.dzd-ev.de:22022/dzdapps/dzd-werk.git
```

```bash
docker build . -t myImageName
```

```bash
docker run -p 80:80 myImageName
```