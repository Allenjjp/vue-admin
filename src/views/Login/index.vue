<template>
    <div id="login">
        <div class="login-wrap">
            <ul class="menu-tab">
                <li 
                v-for="(item, index) in menuTab" 
                :key="index"
                :class="menuTabIndex === index ? 'current' : ''"
                @click="fnToggleMenuTab(index, item.type)"
                >{{ item.txt }}</li>
            </ul>
            <!-- 表单 start -->
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" size="medium" class="login-form">
                <el-form-item prop="username" class="item-form">
                    <label>邮箱</label>
                    <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="password" class="item-form">
                    <label>密码</label>
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item prop="passwords" class="item-form" v-if="model === 'register'">
                    <label>重复密码</label>
                    <el-input type="password" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item prop="code" class="item-form">
                    <label>验证码</label>
                    <el-row :gutter="10">
                        <el-col :span="15">
                            <el-input v-model="ruleForm.code" minlength="6" maxlength="6"></el-input>
                        </el-col>
                        <el-col :span="9">
                            <el-button type="success" class="block">获取验证码</el-button>
                        </el-col>
                    </el-row>
                    
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="submitForm('ruleForm')" class="login-btn block">
                        {{ this.model === 'login' ? '登录' : '注册' }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { stripscript, validateEmail, validatePass, validateVCode } from '@/utils/validate';

export default {
    name: 'login',
    data() {
        // 验证用户名
        var validateUsername = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            } else if (validateEmail(value)) {
                callback(new Error('用户名格式有误'));
            } else {
                callback();
            }
        };
        // 验证密码
        var validatePassword = (rule, value, callback) => {
            // 过滤后的数据
            this.ruleForm.password = stripscript(value);
            value = this.ruleForm.password;

            if (value === '') {
                callback(new Error('请输入密码'));
            } else if (validatePass(value)) {
                callback(new Error('密码为6至20位的数字+字母'));
            } else {
                callback();
            }
        };
        // 验证重复密码
        var validatePasswords = (rule, value, callback) => {
            // 如果模块值为login，直接通过
            if(this.model === 'login') {
                callback();
            }
            // 过滤后的数据
            this.ruleForm.passwords = stripscript(value);
            value = this.ruleForm.passwords;

            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value != this.ruleForm.password) {
                callback(new Error('重复密码不正确'));
            } else {
                callback();
            }
        };
        // 验证验证码
        var validateCode = (rule, value, callback) => {
            if (value === '') {
                return callback(new Error('请输入验证码'));
            } else if (validateVCode(value)) {
                return callback(new Error('验证码格式有误'));
            } else {
                callback();
            }
        };
        return {
            menuTab: [
                { txt: '登录', type: 'login' },
                { txt: '注册', type: 'register' }
            ],
            menuTabIndex: 0,
            // 模块值
            model: 'login',
            // 表单的数据
            ruleForm: {
                username: '',
                password: '',
                passwords: '',
                code: ''
            },
            rules: {
                username: [
                    { validator: validateUsername, trigger: 'blur' }
                ],
                password: [
                    { validator: validatePassword, trigger: 'blur' }
                ],
                passwords: [
                    { validator: validatePasswords, trigger: 'blur' }
                ],
                code: [
                    { validator: validateCode, trigger: 'blur' }
                ]
            }
        }
    },
    created() {},
    mounted() {},
    methods: {
        fnToggleMenuTab(index, type) {
            this.menuTabIndex = index
            return type === 'login' ? this.model = 'login' : this.model = 'register'
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                alert('submit!');
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
#login {
    background-color: #344a5f;
    height: 100vh;
}
.login-wrap {
    width: 330px;
    margin: auto;
}
.menu-tab {
    text-align: center;
    li {
        display: inline-block;
        width: 88px;
        line-height: 36px;
        border-radius: 2px;
        font-size: 14px;
        color: #ffffff;
        cursor: pointer;
    }
    .current {
        background-color: rgba(0, 0, 0, .1);
    }
}
.login-form {
    margin-top: 29px;
    label {
        display: block;
        font-size: 14px;
        color: #ffffff;
    }
    .item-form {
        margin-bottom: 13px;
    }
    .block {
        display: block;
        width: 100%;
    }
    .login-btn {
        margin-top: 19px;
    }
}
</style>


