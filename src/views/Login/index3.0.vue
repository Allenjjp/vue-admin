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
import { reactive, ref, isRef, toRefs, onMounted } from '@vue/composition-api';

export default {
    name: 'login',
    setup(props, { refs }) {
        // 这里面放置data数据、生命周期、自定义的函数

        // 验证用户名
        let validateUsername = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            } else if (validateEmail(value)) {
                callback(new Error('用户名格式有误'));
            } else {
                callback();
            }
        };
        // 验证密码
        let validatePassword = (rule, value, callback) => {
            // 过滤后的数据
            ruleForm.password = stripscript(value);
            value = ruleForm.password;

            if (value === '') {
                callback(new Error('请输入密码'));
            } else if (validatePass(value)) {
                callback(new Error('密码为6至20位的数字+字母'));
            } else {
                callback();
            }
        };
        // 验证重复密码
        let validatePasswords = (rule, value, callback) => {
            // 如果模块值为login，直接通过
            if(model.value === 'login') {
                callback();
            }
            // 过滤后的数据
            ruleForm.passwords = stripscript(value);
            value = ruleForm.passwords;

            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value != ruleForm.password) {
                callback(new Error('重复密码不正确'));
            } else {
                callback();
            }
        };
        // 验证验证码
        let validateCode = (rule, value, callback) => {
            if (value === '') {
                return callback(new Error('请输入验证码'));
            } else if (validateVCode(value)) {
                return callback(new Error('验证码格式有误'));
            } else {
                callback();
            }
        };

        /**
         * 声明数据
         */
        const menuTab = reactive ([
            { txt: '登录', type: 'login' },
            { txt: '注册', type: 'register' }
        ])
        const menuTabIndex = ref(0)
        // 模块值
        const model = ref('login')
        // 表单的数据
        const ruleForm = reactive({
            username: '',
            password: '',
            passwords: '',
            code: ''
        })
        // 表单的验证
        const rules = reactive({
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
        })


        /**
         * 声明函数
         */
        const fnToggleMenuTab = ((index, type) => {
            menuTabIndex.value = index
            return type === 'login' ? model.value = 'login' : model.value = 'register'
        })

        const submitForm = (formName => {
            refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        })

        /**
         * 生命周期
         */
        // 挂载完成后
        onMounted(() => {

        })

        return {
            menuTab,
            menuTabIndex,
            model,
            ruleForm,
            rules,
            fnToggleMenuTab,
            submitForm
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


