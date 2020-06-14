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
            <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm" size="medium" class="login-form">
                <el-form-item prop="username" class="item-form">
                    <label for="username">邮箱</label>
                    <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="password" class="item-form">
                    <label for="password">密码</label>
                    <el-input id="password" type="password" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item prop="passwords" class="item-form" v-if="model === 'register'">
                    <label for="passwords">重复密码</label>
                    <el-input id="passwords" type="password" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item prop="code" class="item-form">
                    <label for="code">验证码</label>
                    <el-row :gutter="10">
                        <el-col :span="15">
                            <el-input id="code" v-model="ruleForm.code" minlength="6" maxlength="6"></el-input>
                        </el-col>
                        <el-col :span="9">
                            <el-button type="success" class="block" @click="getSms()" :disabled="codeButtonStatus.status">{{ codeButtonStatus.text }}</el-button>
                        </el-col>
                    </el-row>
                    
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="submitForm('loginForm')" class="login-btn block" :disabled="loginButtonStatus">
                        {{ model === 'login' ? '登录' : '注册' }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { stripscript, validateEmail, validatePass, validateVCode } from '@/utils/validate';
import { reactive, ref, isRef, toRefs, onMounted } from '@vue/composition-api';
import { GetSms, Register, Login } from '@/api/login';
import sha1 from 'js-sha1';

export default {
    name: 'login',
    setup(props, { refs, root }) {
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
            username: '2584090148@qq.com',
            password: 'abc123',
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
        // 登录按钮禁用状态
        const loginButtonStatus = ref(true)
        // 验证码按钮禁用状态
        const codeButtonStatus = reactive({
            status: false,
            text: '获取验证码'
        })
        // 倒计时
        const timer = ref(null)

        /**
         * 声明函数
         */
        const fnToggleMenuTab = ((index, type) => {
            resetFormData();
            menuTabIndex.value = index;
            return type === 'login' ? model.value = 'login' : model.value = 'register';
            clearCountDown();
        })
        /**
         * 清除表单数据
         */
        const resetFormData = (() => {
            refs.loginForm.resetFields(); // 重置表单数据
        })
        /**
         * 更新按钮的状态
         */
        const updateButtonStatus = ((params) => {
            codeButtonStatus.status = params.status;
            codeButtonStatus.text = params.text;
        })
        /**
         * 获取验证码
         */
        const getSms = (() => {
            // 验证邮箱、密码
            if(ruleForm.username == '') {
                root.$message.error('邮箱不能为空！！');
                return false;
            }
            if(validateEmail(ruleForm.username)) {
                root.$message.error('邮箱格式有误，请重新输入！！');
                return false;
            }
            // 获取验证码
            let requestData = {
                username: ruleForm.username,
                module: model.value
            }
            // 修改获取验证码按钮状态
            updateButtonStatus({
                status: true,
                text: '发送中...'
            })
            GetSms(requestData).then((response) => {
                console.log(response);
                let data = response.data;
                root.$message({
                    message: data.message,
                    type: 'success'
                })
                // 启用登录或注册按钮
                loginButtonStatus.value = false;
                // 调定时器，倒计时
                countDown(60);
            }).catch((error) => {
                console.log(error);
            });
        })
        /**
         * 倒计时
         */
        const countDown = ((number) => {
            // 判断定时器是否存在，存在则清除
            if(timer.value) {
                clearInterval(timer.value);
            }
            // setTimeout 只执行一次
            // setInterval 不断的执行，需要条件才会停止
            let time = number;
            timer.value = setInterval(() => {
                time--;
                if(time === 0) {
                    clearInterval(timer.value);
                    updateButtonStatus({
                        status: false,
                        text: '再次获取'
                    });
                } else {
                    codeButtonStatus.text = `倒计时${time}秒`;
                }
            }, 1000);
        })
        /**
         * 登录
         */
        const login = (() => {
            let requestData = {
                username: ruleForm.username,
                password: ruleForm.password,
                code: ruleForm.code
            }
            // 登录接口
            root.$store.dispatch('app/login', requestData).then(response => {
                // 页面跳转
                root.$router.push({
                    name: 'Console'
                })
            }).catch(error => {});
        })
        /**
         * 注册
         */
        const register = (() => {
            let requestData = {
                username: ruleForm.username,
                password: ruleForm.password,
                code: ruleForm.code,
                module: 'register'
            }
            // 注册接口
            Register(requestData).then(response => {
                console.log(response);
                let data = response.data;
                root.$message({
                    message: data.message,
                    type: 'success'
                })
                // 模拟注册成功
                fnToggleMenuTab(0, 'login');
                clearCountDown();
            }).catch(error => {
                console.log(error);
            })
        })
        /**
         * 清除倒计时
         */
        const clearCountDown = (() => {
            // 还原验证码按钮默认状态
            updateButtonStatus({
                status: false,
                text: '获取验证码'
            });
            // 清除倒计时
            clearInterval(timer.value);
        })
        /**
         * 提交表单
         */
        const submitForm = (formName => {
            refs[formName].validate((valid) => {
                // 表单验证通过
                if (valid) {
                    model.value === 'login' ? login() : register();
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
            loginButtonStatus,
            codeButtonStatus,
            timer,
            fnToggleMenuTab,
            submitForm,
            getSms,
            countDown,
            clearCountDown,
            login,
            register,
            resetFormData
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


