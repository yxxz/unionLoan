$('#LoadingModel').modal('show');
;(function(){
	// 判断浏览器类型
	var initMethod,
		initElem,
		initDate,
		getData,
		initSelectContion;
	var $chineseText,
		$dateText,
		$divisionLine,
		$overDateLabel,
		$barDiv,
		$tableContent,
		$table,
		$thead,
		$tbody,
		$sum_financ_amount;
	// 各厂商销量占比图
	var lineOption = {
			backgroundColor:'#f2f4fa',
			title:{
			   text:'联合贷业务放款统计预览（单位：百万）',
			   y: 10,
			   x: 10,
			   textStyle:{
				   fontSize:12,
				   fontWeight:'normal',
				   color:'#6488ff'
			   }
			},
			tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'none'        // 默认为直线，可选为：'line' | 'shadow'
		        },
		        textStyle: {
		            color: '#ffffff',
		            align:'left'
		        },
		        formatter:function(data){
		        	return data[0].name + '<br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#59adfb"></span>' + data[0].seriesName + ' : ' + data[0].data + '<br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#eca047"></span>' + data[1].seriesName + ' : ' + data[1].data;
		        }
	    	},
	    	legend: {
		    	width:'90%',
		    	x: 'center',
		    	y:'90%',
		    	icon:'rect',
		    	itemWidth: 6,
		    	itemHeight: 6,
		    	itemGap: 25,
		    	selectedMode:false,
		    	textStyle:{
		    		 fontSize:12
		    	},
		        data:['易鑫放款金额', '银行放款金额']
		    },
		    grid: { // 控制图的大小，调整下面这些值就可以，
		        y: 70,
		        y2: '20%',
		        x2: 40,
		        x: 73,
		        borderWidth: 0
		    },
		    xAxis : [
		        {
		            type : 'category',
		            axisLine:{
		            	lineStyle:{
		            		color:'#e2e4ea',
		            		width:1
		            	}
		            },
		            axisTick:{
		            	show:false
		            },
		            splitLine:{
		            	show:false
		            },
		            axisLabel: {
		                textStyle: {
		                    color: '#a0a0a0',
		                    fontStyle: 'normal',
		                    fontSize: 12
		                }
		            },
		            data : []
		        }
		    ],
		    
		    yAxis : [
		        {
		            type : 'value',
		            axisLabel: {
		                margin:15,
		                formatter:function(v){
		                	
		                	return v.toFixed(2);
		                },
		                textStyle: {
		                    color: '#a0a0a0',
		                    fontStyle: 'normal',
		                    fontSize: 12
		                }
		            },
		            axisLine:{
		            	show:false
		            },
		            axisTick:{
		            	show:false
		            },
		            splitLine:{
		            	show:false
		            }           
		        }
		    ],
		    clickable:false	,
		    series : []    
     };
	initElem = function(){
		$barDiv = $('#barDiv');
		$overDateLabel = $('#overDateLabel');
		$chineseText = $('#chineseText');
		$dateText = $('#dateText');
		$divisionLine = $('#divisionLine');
		$sum_financ_amount = $('#sum_financ_amount');
		$tableContent = $('#tableContent');
		$table = $tableContent.find('table');
		$thead = $table.find('thead');
		$tbody = $table.find('tbody');
	};
	initDate = function(startDate, endDate){
		var upTime = $.dataScope(startDate, endDate),
			endDate_sub = endDate.substr(0, 7);
		var dateBind,
			baseConfig,
			initSlider,
			makeEle,
			handTitle;
		dateBind = function(date1,date2){		
			var yearStart=endDate.substr(0, 5)+'01',
			attrSub=endDate_sub.substr(5, endDate_sub.length),
			attr1Year=endDate.substr(0, 5),
			attr2, //半年,
			attr3; //季度
	        if(attrSub === '01'||attrSub === '02' || attrSub === '03' || attrSub === '04' || attrSub === '05' || attrSub === '06'){
	        	attr2=attr1Year+'01';   	
	        	if(attrSub==='01'||attrSub==='02'||attrSub==='03'){
	        		attr3=attr1Year+'01';
	        		
	        	}else if(attrSub==='04'||attrSub==='05'||attrSub==='06'){
	        		attr3=attr1Year+'04';
	        	}
	        }else{
	        	attr2=attr1Year+'07';
	        	if(attrSub==='07'||attrSub==='08'||attrSub==='09'){
	        		attr3=attr1Year+'07';
	        	}else if(attrSub==='10'||attrSub==='11'||attrSub==='12'){
	        		attr3=attr1Year+'10';
	        	}
	        }
			if(date1===endDate_sub && date2===endDate_sub){				//本月
				$('.thisMonth').addClass('radio_btnActive');
			}else if(date1===endDate_sub && date2===attr3){				//季度
				$('.thisQ').addClass('radio_btnActive');
			}else if(date1===endDate_sub && date2===attr2){				//半年
				$('.thisBY').addClass('radio_btnActive');
			}else if(date1===endDate_sub && date2===yearStart){			//本年
				$('.thisY').addClass('radio_btnActive');
			}
		};
		baseConfig = {                          
		        min: 0,
		        max: upTime.length-1,
		        range: true,
		        slide: function (event, ui) {
		        	$('.radio_btn').removeClass('radio_btnActive');
		            var leftTip=upTime[ui.values[0]];
		            var rightTip=upTime[ui.values[1]];
		            dateBind(rightTip,leftTip);
		            $("#slider-range-amount").text(leftTip+','+rightTip);
		            $("#handleLeft").html(leftTip);
		            $("#handleRight").html(rightTip);
		        }
		};	
		initSlider = function(values){
			try{
				$("#slider-range").slider("destroy");
			}catch(e){}	
			var targetConfig = $.extend(true,{},baseConfig,{values:values});
			$("#slider-range").slider(targetConfig);		    
		    var PopupLayer = document.getElementById('PopupLayer');
		    var sliderRange = document.getElementById('slider-range');
		    var slideHandle = sliderRange.getElementsByTagName('span');
		    makeEle = function makeEle(obj,idName){
		    	var ospan =  document.createElement('div');
		    	ospan.setAttribute('id',idName);
		    	obj.appendChild(ospan);
		    }
		    makeEle(slideHandle[0],'handleLeft');
		    makeEle(slideHandle[1],'handleRight');
		    slideHandle[0].style.top = -0.5 +'em';
		    slideHandle[1].style.top = -0.5 +'em';
		    $('#handleLeft').addClass('Timecolor');
		    $('#handleRight').addClass('Timecolor');
		};
		initSlider([0, upTime.length-1])
	    //时间快捷按钮
	    $('.radio_btn').each(function(){
	    	$(this).click(function(){
	    		$('.radio_btn').removeClass('radio_btnActive');
	    		$(this).addClass('radio_btnActive');
	    	});
	    });
	    // 当日 本周 
	    $('#rapidCullDate_ID').find('.thisM').click(function(){
	        var index= $.inArray(endDate_sub, upTime);
	        initSlider([index,index]);
	        handTitle();
	    });
	    //本月
	    $('#rapidCullDate_ID').find('.thisMonth').click(function(){
	        var index= $.inArray(endDate_sub, upTime);
	        initSlider([index,index]);
	        handTitle();
	    });
	    //本季
	    $('#rapidCullDate_ID').find('.thisQ').click(function(){
	        var index1= $.inArray(endDate_sub, upTime);
	        var attr1Year=endDate.substr(0,5);
	        var attrSub=endDate_sub.substr(5,endDate_sub.length);
	        var attr2;
	        var index2;
	        if(attrSub === '01'){
	        	attr2=attr1Year+'01';
	        	index2= $.inArray(attr2, upTime);
	        }else if(attrSub ==='02'){
	        	attr2=attr1Year+'01';
	        	index2= $.inArray(attr2, upTime);
	        }else if(attrSub ==='03'){
	        	attr2=attr1Year+'01';
	        	index2= $.inArray(attr2, upTime);
	        }else if(attrSub ==='04'){
	        	attr2=attr1Year+'04';
	        	index2= $.inArray(attr2, upTime);
	        }else if(attrSub==='05'){
	        	attr2=attr1Year+'04';
	        	index2= $.inArray(attr2, upTime);
	        }else if(attrSub==='06'){
	        	attr2=attr1Year+'04';
	        	index2= $.inArray(attr2, upTime);
	        }else if(attrSub==='07'){
	        	attr2=attr1Year+'07';
	        	index2= $.inArray(attr2, upTime);
	        }else if(attrSub==='08'){
	        	attr2=attr1Year+'07';
	        	index2= $.inArray(attr2, upTime);
	        }else if(attrSub==='09'){
	        	attr2=attr1Year+'07';
	        	index2= $.inArray(attr2, upTime);
	        }else if(attrSub==='10'){
	        	attr2=attr1Year+'10';
	        	index2= $.inArray(attr2, upTime);
	        }else if(attrSub==='11'){
	        	attr2=attr1Year+'10';
	        	index2= $.inArray(attr2, upTime);
	        }else if(attrSub==='12'){
	        	attr2=attr1Year+'10';
	        	index2= $.inArray(attr2, upTime);
	        }
	        initSlider([index2,index1]);
	        handTitle();
	    });
	    //半年
	    $('#rapidCullDate_ID').find('.thisBY').click(function(){
	        var index1= $.inArray(endDate_sub, upTime);
	        var attrSub=endDate_sub.substr(5,endDate_sub.length);
	        var attr1Year=endDate.substr(0,5);
	        var attr2;
	        var index2;
	        if(attrSub==='01'||attrSub==='02'||attrSub==='03'||attrSub==='04'||attrSub==='05'||attrSub==='06'){
	        	attr2=attr1Year+'01';
	        	index2= $.inArray(attr2, upTime);
	        }else{
	        	attr2=attr1Year+'07';
	        	index2= $.inArray(attr2, upTime);
	        }
	        initSlider([index2,index1]);
	        handTitle();
	    });
	    //本年
	    $('#rapidCullDate_ID').find('.thisY').click(function(){
	        var index1= $.inArray(endDate_sub, upTime);
	        var attr1Year=endDate.substr(0,5);
	        var attr2=attr1Year+'01';
	        var index2= $.inArray(attr2, upTime);
	        initSlider([index2,index1]);
	        handTitle();
	    });
	    $('#confirmBtn').click(initSelectContion);
	    $('.nav_top img').click(function(){
	    	window.history.go(-1); 
	    });
	  //滑块显示
	    handTitle = function(){
	 	   var leftTip = upTime[$("#slider-range").slider("values", 0)];
	 	   var rightTip = upTime[$("#slider-range").slider("values", 1)];
	 	   $("#slider-range-amount").text(leftTip+','+rightTip);
	 	   $("#handleLeft").html(leftTip);
	 	   $("#handleRight").html(rightTip);
	    };
	    handTitle();
	};
	getData = function(date){
		$('#LoadingModel').modal('show');
		$.ajax({
 		   url: document.location.origin + '/bi/api/app/unionLoan/getData',
		   //url: document.location.origin + '/pm/app/unionLoan/getData',
 		   dataType : "json",
 		   type : "POST",
 		   async : true,
 		   data: {
 			   date : date
 		   },
 		   success : function(data) {
 			   setTimeout("$('#LoadingModel').modal('hide')",800);
 			   if(data.data.startDate){
 				   initDate(data.data.startDate,data.data.endDate)
 			   }
 			   var showTopDates = data.data.showTopDate.split(',');
 			   if(showTopDates.length > 1){
 				   $chineseText.text(showTopDates[0]);
 				   $divisionLine.show();
 				   $dateText.text(showTopDates[1]);
 			   }else{
 				   $divisionLine.hide();
 				   $chineseText.text('');
 				   $dateText.text(showTopDates[0]);
 			   }
 			   $sum_financ_amount.html('合计放款总额（单位：百万）<span>' + data.data.sum_financ_amount + '</span>');
 			   $overDateLabel.text('数据截止日期：' + data.data.dataOverDate);
 			   var barDivChart= echarts.init($barDiv[0]);
 			   lineOption.xAxis[0].data = data.data.bank_name;
 			   lineOption.color = ['#59adfb', '#eca047'];
 			   lineOption.series = [{
				    name: '易鑫放款金额',
		            type: 'bar',
		            stack: '总量',
		            barWidth: 20,
		            data: data.data.yixin_financ_amount,
		            itemStyle: {
                        normal: {
                            //柱形图圆角，初始化效果
                            barBorderRadius:[4, 4, 4, 4],
                        },
                        emphasis:{
		            		color:'#156cbe'
		            	}
		            }
			   	},{
				    name: '银行放款金额',
		            type: 'bar',
		            stack: '总量',
		            barWidth: 20,
		            data: data.data.bank_financ_amount,
		            itemStyle: {
                        normal: {
                            //柱形图圆角，初始化效果
                            barBorderRadius:[4, 4, 4, 4],
                        },
                        emphasis:{
		            		color:'#d47017'
		            	}
		            }
			   	},{
				    name:'',
		            type:'bar',
		            stack: '总量',
		            itemStyle:{
		            	normal:{
		            		color:'#f0f0f0'
		            	},
		            	emphasis:{
		            		color:'#f0f0f0'
		            	}
		            },
		            data: data.data.fill_financ_amount
			   	}];
 			   	barDivChart.setOption(lineOption);	
 			   	var tableHtml = '',
 			   		i = 0,
 			   		size = data.data.tableData.length;
 			   	for (; i < size; i++) {
 			   		tableHtml += '<tr><td>' + data.data.tableData[i].join('</td><td>') + '</td></tr>'
				}
 			   	$tbody.html(tableHtml);
		   }
	   })
	};
	initSelectContion = function(){
		$(".PopupLayer").animate({top:$(document).height(),opacity:0},500);
        var date;
        if($('.radio_btn.radio_btnActive').length>0){
        	date = $('.radio_btn.radio_btnActive').val();
        }else{
        	date = $('#slider-range-amount').text();
        }
        getData(date);
	};
	initMethod = function(){ //初始化 调用function
		getData('');
	};
	//初始化加载方法
	$(function(){
		/*if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
			$('.nav_top').find('img').css('top','28px');
			$('.nav_top').css({
				'padding-top' : '14px'
			}, {
				'height' : '64px'
			});
			$('.fortyPre').css('margin-top','64px');
			//下部分图高度
		    var bottomHeight=$('body').height()-40-52-42-$('.content').height()-64;
		    $('#sliper').css('height',''+bottomHeight+'px');
		    
		    $('#confirmBtn').css('bottom','-10px');
		} else if (/(Android)/i.test(navigator.userAgent)) {
			$('.nav_top').find('img').css('top','14px');
			$('.nav_top').css({
				'padding-top' : '0px'
			}, {
				'height' : '50px'
			});
			$('.fortyPre').css('margin-top','50px');
			//下部分图高度
		    var bottomHeight2=$('body').height()-40-52-42-$('.content').height()-5-50;
		    $('#sliper').css('height',''+bottomHeight2+'px');
		    
			if (window.appInterface && window.appInterface.setColor) {
				window.appInterface.setColor('223550');
			}
		}*/
		initElem();
		initMethod(); // 初始化 方法
	});
})();
