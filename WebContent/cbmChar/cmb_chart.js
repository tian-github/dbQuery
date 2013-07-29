var cmbChart = {
	url : null,
	store : {
		incomes : [],
		outcomes : [],
		totals : []
	},// 金额 支出 收入 {account: ,date: ,currency:,money:,description:}
	clear : function() {
		cmbChart.url = null;
		cmbChart.store = {
			incomes : [],
			outcomes : [],
			totals : []
		};
		cmbChart.hightChartSetting.series = [];

	},
	// 重新加载文件路径
	reloadData : function(url) {
		$.ajax( {
			url : url ? url : cmbChart.url,
			data : "text",
			success : function(data, textStatus, jqXHR) {
				var array = data.split(/[\n|\r\n]{1,}/);
				for (var i = 0, len = array.length;i < len; i++) {

					var line = array[i];
					// 起始用户信息
				if (line.indexOf("#") == 0) {

				} else {
					var infos = line.split(";");
					if (infos.length == 8) {
						var opts = {
							account : $.trim(infos[0]),
							date : $.trim(infos[1]),
							currency : $.trim(infos[2]),
							outcome : parseFloat($.trim(infos[3])),
							income : parseFloat($.trim(infos[4])),
							total : parseFloat($.trim(infos[5])),
							description : $.trim(infos[6])
						};
						if (opts.income) {
							cmbChart.store.incomes.push(opts);
						} else if (opts.outcome) {
							cmbChart.store.outcomes.push(opts);
						}
						if (opts.total) {
							cmbChart.store.totals.push(opts);
						}
					}
				}

			}
		},
		async : false
	})	;
		return cmbChart.store;
	},
	dataBody : function(data, bodyId) {
		var body = $("#" + bodyId);
		var s = '<TR>' + '<TD>!{index}</TD>' + '<TD>!{account}</TD>'
				+ '<TD>!{date}</TD>' + '<TD>!{currency}</TD>'
				+ '<TD>!{outcome}</TD>' + '<TD>!{income}</TD>'
				+ '<TD>!{total}</TD>' + '<TD>!{descript}</TD>' + '</TR>';
		for (var i = 0, len = data.length;i < len; i++) {
			var sd = data[i];
			var ps = s.replace("!{index}", i).replace("!{account}", sd.account)
					.replace("!{date}", sd.date).replace("!{currency}",
							sd.currency).replace("!{outcome}",
							sd.outcome ? sd.outcome : "").replace("!{income}",
							sd.income ? sd.income : "").replace("!{total}",
							sd.total ? sd.total : "").replace("!{descript}",
							sd.description);
			body.append($(ps));
		};

	},
	seriesParse : function(store, type) {
		if (!store) {
			store = cmbChart.store;
		}
		// 找出时间差
		var rtnData = [];

		var s_data = [];

		if (type == "totals") {
			s_data = store.totals;
			for (var i = 0, len = s_data.length;i < len; i++) {
				var opt = s_data[i];
				var dtArr = opt["date"].split("-");
				var dt = Date.UTC(parseInt(dtArr[0]), parseInt(dtArr[1]) - 1,
						parseInt(dtArr[2]));
				var val = {
					x : dt,
					y : opt.total,
					info : "所剩余额" + opt.total + "元"
				};
				// var val = [dt, opt.total,"所剩余额"];
				rtnData.push(val);
			}
		} else if (type == "income") {
			s_data = store.incomes;
			for (var i = 0, len = s_data.length;i < len; i++) {
				var opt = s_data[i];
				var dtArr = opt["date"].split("-");
				var dt = Date.UTC(parseInt(dtArr[0]), parseInt(dtArr[1]) - 1,
						parseInt(dtArr[2]));
				// var val = [dt, opt.income,opt.description];
				var val = {
					x : dt,
					y : opt.income,
					info : "收入" + opt.income + "元-" + opt.description
				};
				rtnData.push(val);
			}
		} else if (type == "outcome") {
			s_data = store.outcomes;
			for (var i = 0, len = s_data.length;i < len; i++) {
				var opt = s_data[i];
				var dtArr = opt["date"].split("-");
				var dt = Date.UTC(parseInt(dtArr[0]), parseInt(dtArr[1]) - 1,
						parseInt(dtArr[2]));
				// var val = [dt, opt.outcome,opt.description];
				var val = {
					x : dt,
					y : opt.outcome,
					info : "支出" + opt.outcome + "元-" + opt.description
				};
				rtnData.push(val);
			}
		}

		return rtnData;

	},
	// 每天描点一个点
	seriesParseMerge : function(store, type) {
		if (!store) {
			store = cmbChart.store;
		}
		// 找出时间差
		var rtnData = [];
		var s_data = [];
		var e_opt = store.totals[store.totals.length - 1]
		var e_dataAttr = e_opt["date"].split("-");
		var e_dt = Date.UTC(parseInt(e_dataAttr[0]), parseInt(e_dataAttr[1])
				- 1, parseInt(e_dataAttr[2]));

		if (type == "totals") {
			s_data = store.totals;
			var tmpData = null;
			var flag = false;
			for (var i = 0, len = s_data.length;i < len; i++) {
				var opt = s_data[i];
				var dtArr = opt["date"].split("-");
				var dt = Date.UTC(parseInt(dtArr[0]), parseInt(dtArr[1]) - 1,
						parseInt(dtArr[2]));
				var val = {
					x : dt,
					y : opt.total,
					info : "所剩余额" + opt.total + "元",
					dtStr : opt["date"]
				};
				if (!tmpData) {
					tmpData = val;
				} else if (tmpData.dtStr == opt["date"]) {
					tmpData = val;
					if (i == len - 1) {
						flag = true;
					}
				} else if (tmpData.dtStr != opt["date"]) {
					rtnData.push(tmpData);
					tmpData = val;
					if (i == len - 1) {
						rtnData.push(tmpData);
					}
				}
				// var val = [dt, opt.total,"所剩余额"];
				// rtnData.push(val);
			}
			if (flag) {
				rtnData.push(tmpData);
				if (tmpData.x < e_dt) {
					rtnData.push( {
						x : e_dt,
						y : 0.0,
						info : ""
					});
				}
			}
			tmpData = null;

		} else if (type == "income") {
			s_data = store.incomes;
			var tmpData = null;
			var flag = false;
			for (var i = 0, len = s_data.length;i < len; i++) {
				var opt = s_data[i];
				var dtArr = opt["date"].split("-");
				var dt = Date.UTC(parseInt(dtArr[0]), parseInt(dtArr[1]) - 1,
						parseInt(dtArr[2]));
				// var val = [dt, opt.income,opt.description];
				var val = {
					x : dt,
					y : opt.income,
					info : "收入" + opt.income + "元-" + opt.description,
					dtStr : opt["date"]
				};

				if (!tmpData) {
					tmpData = val;
				} else if (tmpData.dtStr == opt["date"]) {
					tmpData.y = tmpData.y + val.y;
					tmpData.info = tmpData.info + "<br>" + val.info;
					if (i == len - 1) {
						flag = true;
					}
				} else if (tmpData.dtStr != opt["date"]) {
					rtnData.push(tmpData);
					tmpData = val;
					if (i == len - 1) {
						// 无效数据填充
						rtnData.push(tmpData);
						if (tmpData.x < e_dt) {
							rtnData.push( {
								x : e_dt,
								y : 0.0,
								info : "0.0元"
							});
						}
					}
					// rtnData.push(val);
				}
			}
			if (flag) {
				rtnData.push(tmpData);
				if (tmpData.x < e_dt) {
					rtnData.push( {
						x : e_dt,
						y : 0.0,
						info : "0.0元"
					});
				}
			}
			tmpData = null;
		} else if (type == "outcome") {
			s_data = store.outcomes;
			var tmpData = null;
			var flag = false;
			for (var i = 0, len = s_data.length;i < len; i++) {
				var opt = s_data[i];
				var dtArr = opt["date"].split("-");
				var dt = Date.UTC(parseInt(dtArr[0]), parseInt(dtArr[1]) - 1,
						parseInt(dtArr[2]));
				// var val = [dt, opt.outcome,opt.description];
				var val = {
					x : dt,
					y : opt.outcome,
					info : "支出" + opt.outcome + "元-" + opt.description,
					dtStr : opt["date"]
				};
				// rtnData.push(val);
				if (!tmpData) {
					tmpData = val;
				} else if (tmpData.dtStr == opt["date"]) {
					tmpData.y = tmpData.y + val.y;
					tmpData.info = tmpData.info + "<br>" + val.info;
					if (i == len - 1) {
						flag = true;
					}
				} else if (tmpData.dtStr != opt["date"]) {
					rtnData.push(tmpData);
					tmpData = val;
					if (i == len - 1) {
						rtnData.push(tmpData);
						if (tmpData.x < e_dt) {
							rtnData.push( {
								x : e_dt,
								y : 0.0,
								info : "0.0元"
							});
						}
					}
				}
				// rtnData.push(val);
			}
			if (flag) {
				rtnData.push(tmpData);
				if (tmpData.x < e_dt) {
					rtnData.push( {
						x : e_dt,
						y : 0.0,
						info : "0.0元"
					});
				}
			}
			tmpData = null;
		}

		return rtnData;
	},

	hightChartSetting : {
		chart : {
			type : 'spline'
		},
		title : {
			text : '<h4>招行个人银行支出收入总金额比对报表</h4>'
		},
		subtitle : {
			text : ''
		},
		xAxis : {
			type : 'datetime',
			labels : {
				formatter : function() {
					return Highcharts.dateFormat('%Y-%m-%d', this.value);
				},
				rotation : 90,
				tickInterval : 1 * 24 * 3600 * 1000
				,
			// Legend:{layout:'vertical'}
			}
		},
		yAxis : {
			title : {
				text : '金额（元）'
			},
			min : 0
		},
		tooltip : {
			formatter : function() {
				return '<b>' + this.series.name + '</b><br/>'
						+ Highcharts.dateFormat('%Y-%m-%d', this.x) + ':<br> '
						+ this.point.options.info;
			}

		},
		series : []
	}

}
