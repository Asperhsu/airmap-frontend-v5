<template>
    <v-ons-page>
        <BackToolbar>關於 設定值</BackToolbar>

        <v-ons-row>
            <v-ons-col width="2em">
                <h1><i class="fa fa-question-circle" aria-hidden="true"></i></h1>
            </v-ons-col>
            <v-ons-col>
                <h1>設定值儲存在哪</h1>
                <p>您的設定值與個人資料皆存放於您的裝置的瀏覽器內，不會傳回伺服器儲存。</p>
                <p>因此當您更換裝置或重置/移除瀏覽器時，設定值都會被清除</p>
                <p><small>
                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                    了解有關 <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage">localStorage</a> API
                </small></p>
            </v-ons-col>
        </v-ons-row>

        <v-ons-row>
            <v-ons-col width="2em">
                <h1><i class="fa fa-question-circle" aria-hidden="true"></i></h1>
            </v-ons-col>
            <v-ons-col>
                <h1>那些設定值會被儲存</h1>
                <ol>
                    <li>地圖設定 (中心點、縮放等級與種類)</li>
                    <li>量測指標(是否顯示與種類)</li>
                    <li>最愛站台</li>
                    <li>顯示語言</li>
                </ol>
                <p>您可使用 設定 頁面的重設按鈕還原初始設定。</p>
            </v-ons-col>
        </v-ons-row>
    </v-ons-page>
</template>

<script>
    import BackToolbar from '@/components/toolbars/BackToolbar'

    export default {
        components: {BackToolbar},
    }
</script>

<style lang="scss" scoped>
    ons-col { padding: 0 1em; }
</style>