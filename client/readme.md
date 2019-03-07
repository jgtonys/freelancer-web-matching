## Frontend Reactjs

1. 환경 구성
```javasciprt
"dependencies": {
  "react": "^16.6.0",
  "react-dom": "^16.6.0",
  "webpack": "^4.23.1",
  "webpack-cli": "^3.1.2",
  "webpack-dev-server": "^3.1.10"
},
"devDependencies": {
  "@babel/core": "^7.1.2",
  "@babel/preset-env": "^7.1.0",
  "@babel/preset-react": "^7.0.0",
  "babel-loader": "^8.0.4",
  "html-webpack-plugin": "^3.2.0"
}
```

**중요**

webpack 4 버전을 사용한다.

babel 8 버전을 사용하기 때문에 기존 babel 7 버전과 다르다.

babel 8 버전은 babel-core, babel-preset-env, babel-preset-react 가 아닌 @babel/core, @babel/preset-env, @babel/preset-react 를 설치해야만 한다.

2. npm package.json 설정

```json
"scripts": {
  "start": "webpack-dev-server --mode development --open --hot",
  "build": "webpack --mode production && rm -rf dist && mv bundle dist",
  "remove": "rm -rf bundle/"
}
```

```npm start``` 명령은 webpack 을 사용하여 현재 진행중인 frontend 개발 상황을 실시간으로 디버깅해준다. hot-reloading 을 사용해서 저장할 때마다 웹의 가상환경에 반영되어 나타난다.

```npm run build``` 명령은 production 모드로, 서버에서 사용할 output file 들을 던져준다. js 스크립트는 compact 하게 나타난다.

```npm run remove``` production 이 실패하고 남은 bundle 파일들을 제거한다.

3. 서버 접속 방법

```sudo ssh -i LightsailDefaultPrivateKey-ap-northeast-2.pem bitnami@54.180.43.18```
