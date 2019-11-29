const App = getApp(); Page({ data: { searchColor: "rgba(0,0,0,0.4)", searchSize: "15", searchName: "搜索商品", sortType: 'all', sortPrice: false, scrollHeight: 0, curNav: true, curIndex: 0, option: {}, list: [], no_more: false, isLoading: true, page: 1, goods_list: {}, showView: true, notcont: false }, onLoad(option) { let _this = this; _this.setListHeight(); _this.setData({ option }); _this.getCategoryList(); _this.getGoodsList(this.data.curIndex + 1) }, setListHeight() { let _this = this; wx.getSystemInfo({ success: function (res) { _this.setData({ scrollHeight: res.windowHeight - 45, }) } }) }, getCategoryList() { let _this = this; App._get('category/index', {}, result => { let data = result.data; _this.setData({ list: data.list, templet: data.templet, curNav: data.list.length > 0 ? data.list[0].category_id : true, notcont: !data.list.length }) }) }, getGoodsList(categoryID, isPage = false, page = 1) { let _this = this; App._get('goods/lists', { page: page || 1, sortType: this.data.sortType, sortPrice: this.data.sortPrice ? 1 : 0, category_id: categoryID || 0, listRows: 10, }, result => { let resList = result.data.list, dataList = _this.data.goods_list; if (isPage == true) { _this.setData({ 'goods_list.data': dataList.data.concat(resList.data), isLoading: false, }) } else { _this.setData({ goods_list: resList, isLoading: false, }) } }) }, selectNav(e) { let _this = this; this.getGoodsList(e.target.dataset.id); _this.setData({ page: 1, no_more: false, curNav: e.target.dataset.id, curIndex: parseInt(e.target.dataset.index), scrollTop: 0 }) }, bindDownLoad() { if (this.data.page >= this.data.goods_list.last_page) { this.setData({ no_more: true }); return false } this.getGoodsList(this.data.curNav, true, ++this.data.page) }, onShareAppMessage() { let _this = this; return { title: _this.data.templet.share_title, path: '/pages/category/index?' + App.getShareUrlParams() } }, onConfirmSubmit(e) { let _this = this, goods_id = e.currentTarget.dataset.goodsid, goods_skuid = e.currentTarget.dataset.goodsskuid; var totalCartNum = wx.getStorageSync("totalCartNum") || 0; wx.setStorageSync("totalCartNum", totalCartNum + 1); App._post_form('cart/add', { goods_id: goods_id, goods_num: 1, goods_sku_id: goods_skuid }, (result) => { App.showSuccess(result.msg); _this.setData(result.data) }) } });