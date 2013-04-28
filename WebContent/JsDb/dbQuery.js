var dbQuery = (function() {
	return {
		// data:{
		// heads:[{h_name:""}],
		// datas:[{d_head:"",d_value:""}]
		// }
		data : {},
		conn : null,
		lock : false,
		reset_conn : function(dbstr) {
			var connection = new ActiveXObject("ADODB.Connection");
			connection.ConnectionString = dbstr;
			this.conn = connection;
			this.lock_conn();
		},
		lock_conn : function() {
			lock = true;
			// .....
		},
		release_conn : function() {
			if (typeof (this.conn) != 'undefined') {
				this.conn = null;
			}
			this.lock = false;

			// ....
		},
		executeQuery : function(sql) {
			var rtn = [];
			if (sql) {
				try {
					this.conn.open();
					var rs = new ActiveXObject("ADODB.Recordset");
					rs.open(sql, this.conn);
					rtn = this.parseRes(rs);
				} finally {
					if (typeof (rs) != 'undefined') {
						rs.close();
					}
					;
					if (typeof (this.conn) != 'undefined') {
						this.conn.close();
					}
				}
			}
			return rtn;

		},
		parseRes : function(rs) {
			var data = [];
			data.datas = {};
			data.datas.records=[];
			var first = true;
			var index=1;
			while (!rs.eof) {
				if (first) {
					var heads = [{h_name:"#"}];
					for ( var i = 0, len = rs.Fields.count; i < len; i++) {
						heads.push({
							h_name : rs.Fields(i).Name
						});
					}
					first = false;
					data["heads"] = heads;
				}
				var records = {field:[{h_head:"#",d_value:index}]};
				for ( var v = 0, v_len = rs.Fields.count; v < v_len; v++) {
					// datas:[{records:[]}]
					// {d_head:"",d_value:""}
					var record={};
					record["h_head"] = rs.Fields(v).Name;
					record["d_value"] = rs.Fields(v).Value;
					records.field.push(record);
				}
				data.datas.records.push(records);
				// ....
				rs.moveNext;
				
				index++;
			}
			return data;
		},
		executeUpdate : function(sql) {
			if (sql) {
				try {
					this.conn.open();
					this.conn.execute(sql);
				} finally {
					this.conn.close();
				}
			}
		}

	}
})();