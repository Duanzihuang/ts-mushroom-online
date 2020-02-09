<template>
    <div>
        <p>课程详情---{{id}}</p>
    </div>
</template>

<script lang="ts">
    import {Component,Vue} from 'vue-property-decorator'

    @Component
    export default class My extends Vue{
        data() {
            return {
                id: null
            }
        }
        created(){
            this.id = this.$route.params.id
        }
    }
</script>