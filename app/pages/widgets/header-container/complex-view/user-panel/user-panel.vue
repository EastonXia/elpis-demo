<template>
 <img src="./assets/avatar.jpg" class="avatar">
  <el-dropdown @command="handleUserCommand">
    <span class="username">
      {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <template #dropdown>
      <el-dropdown-item command="logout">退出登录</el-dropdown-item>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ref } from 'vue';
const lsNickName = localStorage.getItem('nickname');
const userName = ref(lsNickName ?? 'admin');

const handleUserCommand = function(event) {
  if(event === 'logout') {
    window.location = `http://${window.location.host}/api/auth/logout`
  }
}

</script>

<style lang="less" scoped>
 .avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 12px;
}

.username {
  font-size: 16px;
  font-weight: 500;
  height: 60px;
  line-height: 60px;
  cursor: pointer;
  outline: none;
}
</style>