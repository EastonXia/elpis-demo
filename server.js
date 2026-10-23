const { 
  serverStart
} = require('@eastonshay/sara')

const app = serverStart(
  {
    name: 'ElpisDemo',
    homePage: '/view/project-list',
    icon: '/static/favicon.png',
  }
);

