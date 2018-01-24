/**
 * Created by wuziye on 2016/6/12.
 */
$(function(){
    if($.browser.msie && $.browser.version<=6){
        $(".PopupLayer").css("position","absolute");
    }
    var PopupLayer = $(".PopupLayer");
    var winHeight =  document.body.clientHeight;
    var winWidth = document.body.clientWidth;
    var slider = $('#slider-range-amount');
    if(slider.length > 0){
    	slider.hide();
    }
    $(".PopupLayer").css({"top":winHeight+"px","opacity":0,"height":winHeight+'px',"width":winWidth+'px'});//载入页面时将元素置于页面可见区域的顶部达到自上而下显示效果（PS：还有隐藏效果）
    var cancel = '<div class="cancel">选择日期<div class="cancelTip"></div></div>';
    $('.PopupLayer').prepend(cancel);
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    	$('.cancel').find('.cancelTip').css('top','32px');
	    //日期筛选顶部
	    $('.cancel').css({'padding-top' : '14px'}, {'height' : '64px'});
	} else if (/(Android)/i.test(navigator.userAgent)) {
		$('.cancel').find('.cancelTip').css('top','18px');
		//日期筛选顶部
	    $('.cancel').css({'padding-top' : '0px'}, {'height' : '50px'});
	}
    function notice_show(){//显示
        var browser_visible_region_height=document.documentElement.clientHeight;//获取浏览器可见区域高度
        var element_height=$(".PopupLayer").outerHeight();//获取元素高度:height+paelement_heighting+margin
        //计算元素显示时的top值
       // var element_show_top=(browser_visible_region_height-element_height)/2;
        $(".PopupLayer").stop(true).animate({top:0,opacity:1},500);
    }
    function notice_hidden(){//隐藏
        var element_height=$(".PopupLayer").outerHeight();//获取元素高度:height+paelement_heighting+margin
        var ee = element_height;//元素隐藏时的top值
        $(".PopupLayer").stop(true).animate({top:ee,opacity:0},500);
    }
    //$("a.close").click(function(){
    //    var element_height=$(".PopupLayer").outerHeight();//获取元素高度:height+paelement_heighting+margin
    //    var ee= element_height;//元素隐藏时的top值
    //    $(".PopupLayer").animate({opacity:0},1000).animate({top:ee},1000);
    //})
    // 点击关闭按钮隐藏
  //获取数据库最新时间数组
    $("#click").click(function(){
        notice_show();
        var dateSelect=$('.showCondition').eq(0).text();
        if(dateSelect+'' === '上半年'||dateSelect+'' === '下半年'){
        	dateSelect = '半年';
        }
        if(dateSelect.length>5){
        	$('.radio_btn').removeClass('radio_btnActive');
           var Today_sub=Today.substr(0,7);
           var upTime=dataScope('2015-12-01',Today);
           var attr1=dateSelect.substr(0,7);
           var attr2=dateSelect.substr(8,dateSelect.length);
           index1= $.inArray(attr1, upTime);
           index2= $.inArray(attr2, upTime);
           $("#slider-range").slider({
               values:[index1,index2]
           });
           $("#handleLeft").html(attr1);
           $("#handleRight").html(attr2);
        }else{
        	$('.radio_btn').each(function(){
        		if($(this).val()+ ''=== dateSelect+''){
        			$(this).click();
        		}
        	});
        }
    });//单击按钮触发显示
    $("#close").click(function(){
        notice_hidden();
    });//单击按钮触发隐藏
	$('.cancelTip').click(function(){
		notice_hidden();
	});
    function check(){
        var kk=$(".PopupLayer").outerHeight();//获取元素高度:height+paelement_heighting+margin
        var ww=$(document).height();
        var qq= parseInt($(".PopupLayer").css("top"));//获取元素当前的top值，String类型转换为number类型
        if(qq+'' === kk+'' || qq+'' === ww+''){
            return;
        }else{//弹出层自适应浏览器窗口大小。
            var browser_visible_region_height = document.documentElement.clientHeight;//获取浏览器可见区域高度
        	//var browser_visible_region_height = document.offsetHeight;
           //var element_height=$(".PopupLayer").outerHeight();//获取元素高度:height+paelement_heighting+margin
            $(".PopupLayer").outerHeight(ww);
            //计算元素显示时的top值
            var element_show_top=(browser_visible_region_height-element_height)/2;
            $(".PopupLayer").stop(true).animate({top:0},150);
        }
    }
     var pNum = $('.PopupLayer').find('p');
     pNum[0].style.display = 'none';
    $(window).resize(function(){
        check();
    });//自适应浏览器窗口大小
});