var http = require('http');
var url = require('url');
var qs = require('querystring');
var db = require('./db');
var port = 8080

http.createServer(function (req, res) {

    var q = url.parse(req.url, true);
    
    var id = q.query.id;

    res.setHeader('Content-Type', 'application/json');
    
    if(q.pathname == "/products" && req.method === "GET"){

        if(id === undefined){
            //list product
            let sql = "SELECT * FROM products";
    
            db.query(sql,(err, result) => {
                if (err) throw err;
                
                res.end(JSON.stringify(result));
                
            });
    
        }else if(id > 0){
            //get one product
            let sql = "SELECT * FROM products where id = "+ id;
            
            db.query(sql,(err, result) => {
                if (err) throw err;
                
                var product = result[0];
    
                res.end(JSON.stringify(product));
                
            });
    
        }
        
    }

    else if(q.pathname == "/products" && req.method === "POST"){
    	//save product
    	
    	var body = '';

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });
    	
    	req.on('end', function () {
            
            var postData = qs.parse(body);

            let nama = postData.nama;
            let harga = postData.harga;

            let sql = `insert into products (nama, harga) values ( '${nama}', '${harga}' )`

			db.query(sql,(err, result) => {
		        if (err) throw err;
			    
			    if(result.affectedRows == 1){
			    	res.end(JSON.stringify({message: 'success'}));	
			    }else{
					res.end(JSON.stringify({message: 'gagal'}));	
			    }
			    
		    });    	
    	
    	});
    	
    	
    }

    else if(q.pathname == "/products" && req.method === "PUT"){
    	//update product  
    	var body = '';

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });
    	
    	req.on('end', function () {
            
            var postData = qs.parse(body);

            let nama = postData.nama;

            let harga = postData.harga;

            let sql = `UPDATE  products set nama = '${nama}', harga = '${harga}' where id = ${id}`

			db.query(sql,(err, result) => {
		        if (err) throw err;
			    
			    if(result.affectedRows == 1){
			    	res.end(JSON.stringify({message: 'success'}));	
			    }else{
					res.end(JSON.stringify({message: 'gagal'}));	
			    }
			    
		    });    	
    	
    	});  
    	
    }

    else if(q.pathname == "/products" && req.method === "DELETE"){
    	//delete product    
  		
    	let sql = `DELETE FROM products where id = ${id}`

		db.query(sql,(err, result) => {
	        if (err) throw err;
		    
		    if(result.affectedRows == 1){
		    	res.end(JSON.stringify({message: 'success'}));	
		    }else{
				res.end(JSON.stringify({message: 'gagal'}));	
		    }
		    
	    });    	

    }else{

    	res.end();	

    }

}).listen(port);

console.log('server berjalan di http://localhost:'+ port);