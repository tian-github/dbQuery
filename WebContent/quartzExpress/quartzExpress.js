var quartzUtil = (function() {
	return {
		/**
		 * 数据获取,从data获取到key的值,没有就返回默认值
		 */
		getValue : function(data, key, def) {
			if (typeof(data[key]) == 'undefined') {
				return def;
			} else {
				if (data[key]) {
					return data[key];
				} else {
					return def;
				}
			}
		},
		/**
		 * 表达式转换
		 * data定义
		 * 
		 * 
		 * 
		 */
		parse : function(data) {
			var parseArray = [];
			var rate = data["rate"];
			switch (rate) {
				//每年
				case "year" :
				//0  0  0  10  12    ?    *
					var hour = quartzUtil.getValue(data, "hour", "0");
					var min = quartzUtil.getValue(data, "min", "0");
					var second = quartzUtil.getValue(data, "second", "0");
					var day=quartzUtil.getValue(data, "day", "0");
					var month=quartzUtil.getValue(data, "month", "0");
					var rtn = [second, min,hour , day, month,"*","?"];
					return rtn.join(" ");
					break;
				//每月
				case "month" :
					//"0 15 10 15 * ?" 
					var hour = quartzUtil.getValue(data, "hour", "0");
					var min = quartzUtil.getValue(data, "min", "0");
					var second = quartzUtil.getValue(data, "second", "0");
					var day=quartzUtil.getValue(data, "day", "1");
					var rtn = [second, min,hour , day, "*", "?"];
					return rtn.join(" ");
					break;
				//每星期	
				case "week" :
					var hour = quartzUtil.getValue(data, "hour", "0");
					var min = quartzUtil.getValue(data, "min", "0");
					var second = quartzUtil.getValue(data, "second", "0");
					var week = quartzUtil.getValue(data, "week", "error");
					if(week=="error"){
						alert("error");
						return ;
					}
					var rtn = [second, min,hour , "?", "*", week];
					return rtn.join(" ");
					//0 0 12 ? * WED
					break;
				//每天
				case "day" :
					var hour = quartzUtil.getValue(data, "hour", "0");
					var min = quartzUtil.getValue(data, "min", "0");
					var second = quartzUtil.getValue(data, "second", "0");
					var rtn = [second, min,hour , "*", "*", "?"];
					return rtn.join(" ");
					break;
				//每小时
				case "hour" :
				//59 30 * * * ?
					var min = quartzUtil.getValue(data, "min", "0");
					var second = quartzUtil.getValue(data, "second", "0");
					var rtn = [second, min,"*" , "*", "*", "?"];
					return rtn.join(" ");
					break;
				//每分钟	
				case "min" :
					var second = quartzUtil.getValue(data, "second", "0");
					var rtn = [second, "*","*" , "*", "*", "?"];
					return rtn.join(" ");
					break;
				default :
					break;
			}
		}
	}
})();

(function() {
	//隐藏所以配置表达式项
	$("div[rate]").each(function(index, elem) {
		$(elem).hide("fast");
	});
	//绑定change事件
	$("#rateControl").bind("change", function() {

		var s_value = $(this).val();
		//隐藏配置项
		$("div[rate]").each(function(index, elem) {
			$(elem).hide("fast");
		})
		//显示配置项
		if (s_value) {
			$("div[rate=" + s_value + "]").show("fast");
		}
	})

	//执行解析后返回结果
	$("#result").bind(
			"click",
			function() {
				var data = {};
				var s_value = $("#rateControl").val();
				data["rate"] = s_value;
				//找到对应频率下找对应的值
				$("div[rate=" + s_value + "]").find("[f_type]").each(function(
						index, elem) {
					var s_attr = $(elem).attr("f_type");
					data[s_attr] = $(elem).val();
				});
				var res = quartzUtil.parse(data);
				alert(res);

			});

})();
