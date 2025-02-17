module.exports ={
  model: 'dashboard',
  name: '课程系统',
  menu: [{
    key: 'video',
    name: '视频管理',
    moduleType: 'custom',
    menuType: 'module',
    customConfig: {
      path: '/todo'
    }
  },{
    key: 'user',
    name: '用户管理',
    moduleType: 'custom',
    menuType: 'module',
    customConfig: {
      path: '/todo'
    }
  }]
}