export default {
    setting: {
        showIndicator: '顯示指示條',
        showPublishWatermark: '顯示資料時間戳記',
        measureType: '量測指標',
        other: '其他',

        windLayer: {
            title: '風力線',
            enable: '啟動',
            fillOpacity: '線條亮度',
            moveSpeed: '線條亮度',
            information: '資訊',
            publishTime: '資料時間',
            waitForReturnMap: '待返回地圖後載入',
            notice: '提醒',
            noticeText: '風力線十分消耗資源，容易造成瀏覽器當機，請斟酌使用。風力資料於 5, 11, 17, 23 半整點(UTC +8)更新資料',
        },

        map: {
            title: '地圖設定',
        },

        mapType: {
            title: '地圖類型',
            site: '站點地圖',
            town: '鄉鎮地圖',
        },

        startupUseMyLocation: {
            title: '啟動時顯示我的位置',
            enable: '啟動',
        },

        geolocation: {
            title: '我的位置定位方法',

            google: {
                title: 'Google 網路定位',
                info: '使用網路位址推算地理位置，可能不正確或有誤差',
            },

            geo: {
                title: '瀏覽器定位',
                info: '使用HTML5定位，如有GPS裝置則使用；需要您授權使用，較為準確。',
            },
        }
    },
}