let App = getApp(); Page({ data: { list: [], }, onLoad: function (options) { }, onShow: function () { this.getHelpList() }, getHelpList: function () { let _this = this; App._get('wxapp/help', {}, function (result) { _this.setData(result.data) }) }, })