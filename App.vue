<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* 图标对应的 Unicode */
	.icon-home:before { content: "\e600"; }
	.icon-forum:before { content: "\e601"; }
	.icon-location:before { content: "\e602"; }
	.icon-user:before { content: "\e603"; }
	.icon-product:before { content: "\e604"; }
	.icon-more:before { content: "\e605"; }
	/* 添加更多图标的 Unicode */

	page {
		background: #f5f5f5;
	}
</style>
