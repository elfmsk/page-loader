install:
	npm install

start:
	npx babel-node -- src/bin/page-loader.js

publish:
	npm publish

lint:
	npm run eslint .

test:
	npm test
