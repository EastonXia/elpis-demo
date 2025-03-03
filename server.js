const { 
  serverStart
} = require('@eastonshay/love-elpis')

const app = serverStart(
  {
    name: 'ElpisDemo',
    homePage: '/view/project-list',
    icon: '/static/favicon.png',
  }
);

