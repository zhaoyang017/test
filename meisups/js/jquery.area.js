/**
 * jquery.area.js
 * 移动端省市区三级联动选择插件
 * author: 锐不可挡
 * date: 2016-06-17
 **/

/*定义三级省市区数据*/
var expressArea, areaCont, areaList = $("#areaList");

//var areaTop = areaList.offset().top;

/*初始化省份*/
function intProvince() {
	areaCont = "";
	$.ajax({
		type: 'GET',
		url: 'http://wx.touchworld-sh.com/api/yp/location',
		data: {type: 'province'},
		dataType: "json",
		async: false,
        success: function (data) {
         	for(var i = 0; i < data.length; i++) {
				areaCont += '<li onClick="selectP(' + i + ',' + "'" + data[i].toString() +"'"+');">' + data[i] + '</li>';
			}
        },
        error: function (res) {
        }
	});
	areaList.html(areaCont);
	$("#areaBox").scrollTop(0);
	$("#backUp").removeAttr("onClick").hide();
}
intProvince();

/*选择省份*/
function selectP(p,c) {
	areaCont = "";
	areaList.html("");
	$.ajax({
		type: 'GET',
		url: 'http://wx.touchworld-sh.com/api/yp/location',
		data: {type: 'city',value: c},
        dataType: "json",
        async: false,
        success: function (data) {
        	for(var i = 0; i < data.length; i++) {
				areaCont += '<li onClick="selectC(' + i + ',' + "'" + data[i].toString() +"'"+');">' + data[i] + '</li>';
			}
        },
        error: function (res) {
        	console.log(res)
        }
	});
	areaList.html(areaCont);
	$("#areaBox").scrollTop(0);
	$('.area-list li').css({
		'font-size': '20px'
	});
}

/*选择城市*/
function selectC(p,c){
	areaCont = "";
	$.ajax({
		type: 'GET',
		url: 'http://wx.touchworld-sh.com/api/yp/location',
		data: {type: 'location',value: c},
		contentType: "application/x-www-form-urlencoded",
        dataType: "json",
        async: false,
        success: function (data) {
        	for(var i = 0; i < data.length; i++) {
				areaCont += '<li onClick="selectD(' + i + ',' + "'" + data[i].toString() +"'"+');">' + data[i] + '</li>';
			}
        },
        error: function (res) {
        }
	});
	areaList.html(areaCont);
	$("#areaBox").scrollTop(0);
	$('.area-list li').css({
		'font-size': '20px'
	});
	$("#backUp").attr("onClick", "selectP(" + p + ");");
}

/*选择区县*/
function selectD(p, c) {
	clockArea();
	//场次显示出来
	$("#expressArea dl dd").html(c);
	if($("#expressArea dl dd").text() != '点击此处选择门店' && $(".code input").val() != '咨询店员获取验证码并输入' && $(".code input").val() != ''){
		//	当用户选择完场次,按钮变成黄色高亮状态
		$('.footer .btn .confirm img').attr('src', 'img/index/btn2.png');
		//	当用户选择完场次后,绑定提交按钮,信息提交到后台
		$('.footer .btn label').attr('onClick', 'Verification("'+ $("#expressArea dl dd").text() + '"' + ',' + $(".code input").val() +')');
	}
}

/*关闭省市区选项*/
function clockArea() {
	$("#areaMask").fadeOut();
	$("#areaLayer").animate({ "bottom": "-100%" });
	$('.footer .btn').animate({ "z-index": "300" });
	intProvince();
}

/*禁止滑动*/
var noscroll = function(e){
	e.preventDefault();
}
/*验证场次信息和验证码*/
function Verification(local,num){
	//禁止页面滚动
	$('.page1')[0].addEventListener('touchmove',noscroll);

	$('.popup .trueLocation').text($("#expressArea dl dd").text().toString());
	$('.popup .trueNum').text($(".code input").val());
	if($('.footer .btn .confirm img').attr('src').indexOf('btn2.png') > 0){
		$.ajax({
			type: 'GET',
			url: 'http://wx.touchworld-sh.com/api/yp/verify',
			data: {verify: num,location: local},
	        dataType: "json",
	        async: false,
	        success: function (data) {
	        	if(data){
	        		$('.popup').show();
	        		$('.popup .popupTrue').show().siblings().hide();
	        	}else{
	        		$('.popup').show();
	        		$('.popup .popupFalse').show().siblings().hide();
	        	}
	        },
	        error: function (res) {
	        }
		});
	}
	
}

$(function() {
	/*输入验证码*/
	$(".code input").focus(function(){
		$(".code input").val("");
		$(".code input").attr("placeholder","");
	});
	$(".code input").blur(function(){
		$(".code input").attr("placeholder","咨询店员获取验证码并输入");
		if($("#expressArea dl dd").text() != '点击此处选择门店' && $(".code input").val() != '咨询店员获取验证码并输入' && $(".code input").val() != ''){
			//	当用户选择完场次,按钮变成黄色高亮状态
			$('.footer .btn .confirm img').attr('src', 'img/index/btn2.png');
			//	当用户选择完场次后,绑定提交按钮,信息提交到后台
			$('.footer .btn label').attr('onClick', 'Verification("'+ $("#expressArea dl dd").text() + '"' + ',' + $(".code input").val() +')');
		}
	});
	/*打开省市区选项*/
	$("#expressArea").click(function() {
		$("#areaMask").fadeIn();
		$("#areaLayer").animate({ "bottom": 0 });
		$('.footer .btn').css('z-index', '10');
	});
	/*关闭省市区选项*/
	$("#areaMask, #closeArea").click(function() {
		clockArea();
	});
	/*关闭弹窗*/
	$('.popup .close').click(function(){
		$('.popup').hide();
		$("#expressArea dl dd").text('点击此处选择门店');
		$(".code input").val('咨询店员获取验证码并输入');
		$('.footer .btn .confirm img').attr('src', 'img/index/btn.png');
		//允许页面滚动
		$('.page1')[0].removeEventListener('touchmove',noscroll);
	});
	$('.popup .backBtn').click(function(){
		$('.popup').hide();
		$("#expressArea dl dd").text('点击此处选择门店');
		$(".code input").val('咨询店员获取验证码并输入');
		$('.footer .btn .confirm img').attr('src', 'img/index/btn.png');
		//允许页面滚动
		$('.page1')[0].removeEventListener('touchmove',noscroll);
	});

	$('.popup .confirmBtn').click(function(){
		var val = $("#expressArea dl dd").text().toString();
		$('form .location').attr('value',val);
		$('form').submit();
	});


});