const App = getApp(); Page({ data: { isData: false, words: {}, user: {}, dealer: {}, }, onLoad: function (options) { }, onShow: function () { this.getDealerCenter() }, getDealerCenter: function () { let _this = this; App._get('user.dealer/center', {}, function (result) { let data = result.data; data.isData = true; wx.setNavigationBarTitle({ title: data.words.index.title.value }); _this.setData(data) }) }, navigationToWithdraw: function () { wx.navigateTo({ url: '../withdraw/apply/apply', }) }, triggerApply: function (e) { App.saveFormId(e.detail.formId); wx.navigateTo({ url: '../apply/apply', }) }, })