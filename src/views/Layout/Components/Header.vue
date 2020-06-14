<template>
    <div id="header-wrap">
        <div class="pull-left header-icon" @click="navMenuState">
            <svg-icon iconClass="menu" className="menu"/>
        </div>
        <div class="pull-right">
            <div class="user-info pull-left">
                <img src="../../../assets/avatar.jpg" alt="">
                {{ username }}
            </div>
            <div class="header-icon pull-left" @click="exit">
                <svg-icon iconClass="exit" className="exit"/>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, ref, isRef, toRefs, onMounted, computed } from '@vue/composition-api';

export default {
    name: 'layoutHeader',
    setup(props, { root }) {
        const navMenuState = (() => {
            root.$store.commit('app/SET_COLLAPSE')
        })
        const username = computed(() => root.$store.state.app.username)

        const exit = () => {
            root.$store.dispatch('app/exit').then((result) => {
                root.$router.push({
                    name: "Login"
                })
            })
        }

        return {
            navMenuState,
            username,
            exit
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "../../../styles/config.scss";

    #header-wrap {
        position: fixed;
        top: 0;
        right: 0;
        height: 75px;
        background-color: #fff;
        box-shadow: 0 3px 16px 0 rgba(0, 0, 0, .1);
        @include webkit(box-shadow, 0 3px 16px 0 rgba(0, 0, 0, .1));
        @include webkit(transition, all .3s ease 0s);
        line-height: 75px;
    }
    .header-icon {
        padding: 0 32px;
        svg {
            font-size: 25px;
            margin-bottom: -8px;
            cursor: pointer;
        }
    }
    .user-info {
        height: 100%;
        padding: 0 32px;
        border-right: 1px solid #ededed;
        + .header-icon {
            padding: 0 28px;
        }
        img {
            display: inline-block;
            margin-bottom: -12px;
            margin-right: 12px;
            border-radius: 50px;
            width: 40px;
            height: 40px;
        }
    }

    .open {
        #header-wrap {
            left: $navMenu;
        }
    }
    .close {
        #header-wrap {
            left: $navMenuMin;
        }
    }
</style>


