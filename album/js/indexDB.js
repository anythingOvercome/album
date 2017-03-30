var localDatabase = {};
var dbName = "albumDb";
localDatabase.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
localDatabase.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
localDatabase.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;

localDatabase.indexedDB.onerror = function (e) {
	console.log("Database error: " + e.target.errorCode);
};
//打开数据库的最新版本
function openDatabase() {
	var openRequest = localDatabase.indexedDB.open(dbName,7);
	openRequest.onerror = function(e) {
		console.log("Database error: " + e.target.errorCode);
	};
	openRequest.onsuccess = function(event) {
		//返回IDBDatabase对象，主要为本地连接成功之后反馈的IDBDatabase一些属性
		localDatabase.db = openRequest.result;
		fetchAllAlbum();
		fetchPictures();
	};
	//创建对象存储
	openRequest.onupgradeneeded = function (evt) {   
		console.log('Creating object stores');
    	var albumStore = evt.currentTarget.result.createObjectStore("album", {keyPath: "albumId"});
		albumStore.createIndex("albumIndex", "albumName", { unique: true });
		var pictureStore = evt.currentTarget.result.createObjectStore("picture", {keyPath: "pictureId"});
		pictureStore.createIndex("albumIndex", "albumId", { unique: false });
		pictureStore.createIndex("albumNameIndex", "albumName", { unique: false });
		pictureStore.createIndex("pictureIndex", "pictureSrc", { unique: true });
    };
}
//创建一条相册名记录,注意插入时，主键不能相同
function addEmployee(value) {
	try {
		var transaction = localDatabase.db.transaction("album", "readwrite");
		var store = transaction.objectStore("album");                    
	  
		if (localDatabase != null && localDatabase.db != null) {
			var now = new Date();
			var id = now.getTime();
			var request = store.add({
				"albumId": id,
				"albumName" : value,
			});
			request.onsuccess = function(e) {
				alert("This record was added successfully.");
				fetchAllAlbum();
				fetchPictures();
			};
			
			request.onerror = function(e) {
				console.log(e.value);
				alert("This record was not added.");
			};
		}
	}
	catch(e){
		console.log(e);
	}
}
//创建一条图片信息记录,注意插入时，主键不能相同
function addPicture(albumId,albumName,pictureSrc) {
	try {
		var transaction = localDatabase.db.transaction("picture", "readwrite");
		var store = transaction.objectStore("picture");                    
		if (localDatabase != null && localDatabase.db != null) {
			var now = new Date();
			var id = now.getTime();
			//console.log(albumId+'相册ID'+albumName+'相册名称'+pictureSrc+'相片src'+id)
			var request = store.add({
				"pictureId": id,
				"albumId" : albumId,
				"albumName" : albumName,
				"pictureSrc": pictureSrc,
			});
			request.onsuccess = function(e) {
				alert("This record was added successfully.");
				//fetchAllAlbum();
				fetchPictures();
				fetchAllPictures(albumName,albumId)
				$("#myImgLoadModal").modal("hide");
			};
			
			request.onerror = function(e) {
				console.log(e.value);
				alert("This record was not added.");
			};
		}
	}
	catch(e){
		console.log(e);
	}
}
//迭代所有相册记录
function fetchAllAlbum() {
	try {
		var result = document.getElementById("selectAlbum");
		result.innerHTML = "";
		var albumList = document.getElementById("albumList");
		albumList.innerHTML = "";
		
		if (localDatabase != null && localDatabase.db != null) {
			var store = localDatabase.db.transaction("album").objectStore("album");
			var request = store.openCursor();
			request.onsuccess = function(evt) {  
			    var cursor = evt.target.result; 
			    if (cursor) {
			    	var album = cursor.value;
			    	var v = album;
			    	//console.log(album.albumName)
			    	//var jsonStr = JSON.stringify(album);
			    	//console.log(typeof(jsonStr))
			    	//result.innerHTML = result.innerHTML + "<br/>" + jsonStr; 
			    	if(!result.innerHTML){
			    		result.innerHTML += '<option data-id="'+v.albumId
			    						 +'" selected>'+v.albumName+'</option>' ;
			    		//albumId = v.albumId;
			    		//console.log(albumId)
			    	}else{
			    		result.innerHTML += '<option data-id="'+v.albumId
			    						 +'">'+v.albumName+'</option>' ;
			    	}
			    	if(!v.albumName){
			    		albumList.innerHTML+='<div class="alert alert-info" role="alert">暂无相关内容</div>';
			    	}else{
			    		albumList.innerHTML +='<div class="panel panel-default panel-album col-md-3 album-list">'
			    			                +'<div class="panel-heading">'+v.albumName+'<span id="'+v.albumId+'" class="glyphicon glyphicon-trash" onclick="deleteDataByKey('+v.albumId+')"></span></div>'
                							+'<div class="panel-body"><a data-aid="'+v.albumId+'" href="album_show.html?albumId='+v.albumId+'" class="thumbnail">'
                							+'<div class="album"><img src="#" alt="..." data-picid="'+v.albumId+'"></div>'
                							+'<div class="caption"><h5 >共<span data-numid='+v.albumId+'>'+0+'</span>张</h5></div></a></div></div>'
			    	}
			    	fetchAllPictures(v.albumName,v.albumId);
			        cursor.continue(); 
			    }
			};
		}
	}
	catch(e){
		console.log(e);
	}
}
//删除操作
function deleteDataByKey(albumId){
	//console.log(typeof(albumId))
	//alert(1)
    var transaction=localDatabase.db.transaction('album','readwrite'); 
    var store=transaction.objectStore('album'); 
    var request = store.delete(albumId);
    request.onsuccess = function(){
    	alert('success')
    	fetchAllAlbum();
    	fetchPictures();
    }
    /*fetchAllAlbum();
    fetchPictures();*/
}
//获取某一相册中的图片
function fetchAllPictures(albumName,albumId) {
	try {
		if (localDatabase != null && localDatabase.db != null) {
			var store = localDatabase.db.transaction("picture").objectStore("picture");
			var index = store.index("albumNameIndex");
			var range = IDBKeyRange.only(albumName);
			var request = index.openCursor(range);
			var count = 0;
			request.onsuccess = function(evt) {  
			    var cursor = evt.target.result;
			    //var count = 0;
			    if (cursor) {
			    	var picture = cursor.value;
			    	var v = picture;
			    	count=count+1;
			    	//console.log(count);
			        cursor.continue(); 
			    }else{
			    	//console.log(count);
			    	$('[data-numid='+albumId+']').text(count);
			    	//var _href = $('[data-aid='+albumId+']').attr('href');
			    	//$('[data-aid='+albumId+']').attr('href',_href+count)
			    }
			};
			
		}
	}
	catch(e){
		console.log(e);
	}
}
//获取某一相册中的某一张图片
function fetchPictures() {
	try {
		if (localDatabase != null && localDatabase.db != null) {
			var store = localDatabase.db.transaction("picture").objectStore("picture");
			var index = store.index("albumIndex");
			var request = index.openCursor();
			request.onsuccess = function(evt) {  
			    var cursor = evt.target.result; 
			    if (cursor) {
			    	var picture = cursor.value;
			    	var v = picture;
			    	//var jsonStr = JSON.stringify(album);
			    	//console.log(typeof(jsonStr))
			    	//result.innerHTML = result.innerHTML + "<br/>" + jsonStr; 
			    	var picSrc = $('[data-picid='+v.albumId+']').attr("src");
			    	if(picSrc === "#"){
			    		$('[data-picid='+v.albumId+']').attr('src',v.pictureSrc);
			    	}
			        cursor.continue(); 
			    }
			};
			
		}
	}
	catch(e){
		console.log(e);
	}
}
//创建相册
function creatAlbum(){
	var albumName = $("#albumName").val();
	var patrn=/[\"\'<>``!@#$%^&*+-\/\/\/\\//?,.]/;    
	if (patrn.exec(albumName)){
		layer.msg("不允许输入英文状态下的特殊字符！");
		return false;
	} 
	if(albumName.trim()=="" || albumName.trim()==null){
		layer.msg('相册名不能为空！');
		return;
	}else if(albumName.trim().length>20){
		layer.msg('相册名长度不能超过20！');
		return;
	}else{
		addEmployee(albumName);
		$("#myNewCreateImgModal").modal("hide");
	}
}
//图片渲染存储
function readAsDataURL(){
    //检验是否为图像文件  
    var file = document.getElementById("fileInput").files[0];  
    if(!/image\/\w+/.test(file.type)){  
        alert("看清楚，这个需要图片！");  
        return false;  
    }	
    var reader = new FileReader();  
    //将文件以Data URL形式读入页面  
    reader.readAsDataURL(file);  
    reader.onload=function(e){ 
    	//console.log(this);
        var result=document.getElementById("result");  
        //显示文件  
        result.innerHTML='<img src="' + this.result +'" alt="" />'; 
        draw(this.result);
    }  
} 
//图片上传处理
function handlerFiles(files){
	var fileLimit=10;
	var sizeLimit=500;
	var imageType=/image.*/;
	var imgPanel=document.getElementById("imgPanel");
	imgPanel.innerHTML='';
	var sizeLimitBytes=sizeLimit*1024;
	if(files.length<fileLimit){
		for(var i=0;i<files.length;i++){
			var file=files[i];
			if(file.type.match(imageType)){
				if(file.size<sizeLimitBytes){
					var img=document.createElement('img');
					img.file=file;
					img.className='highlight';
					imgPanel.appendChild(img);
					
					var reader = new FileReader();
					reader.onload=(function(aImg){
						return function(e){
							aImg.src=e.target.result;
						}
					})(img)
					reader.readAsDataURL(file);
				}else{
					alert(file.name+'超过'+sizeLimit+'kB');
				}
			}else{
				alert(file.name+'不是一张图片')
			}
		}
	}else{
		imgPanel.innerHTML='一次最多只能上传'+fileLimit+'张图片';
	}
}

$(document).ready(function(){
	openDatabase();
	$("#fileInput").change(function(){
		var files = document.getElementById('fileInput').files;
		console.log(files)
		handlerFiles(files);
	})
	
	$("#imgUpload").click(function(){
		var albumId = $("#selectAlbum option:selected").attr("data-id");
		var albumName = $("#selectAlbum option:selected").val();
		//console.log(albumId+'======'+albumName)
		$("#imgPanel").find("img").each(function(k,v){
			var pictureSrc = $(this).attr("src");
			//console.log(albumId+'======'+albumName)
			addPicture(albumId,albumName,pictureSrc);
		})
	})
})