module.exports = {
  name: 'elpis-demo-beta',

  // 数据库配置
  db: {
    client: 'mysql',
    connection: {
      host: 'gz-cdb-k87vclb9.sql.tencentcdb.com',
      port: '26974',
      database: 'elpis_beta',
      user: 'root',
      password: 'Zxcvbnm1'
    },
    pool: {
      min: 5,
      max: 20,
    }
  }
}