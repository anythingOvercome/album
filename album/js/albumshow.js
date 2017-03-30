function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}
var albumId = getQueryString('albumId');

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
		fetchAllPictures();
	};
}

//获取某一相册中的图片
function fetchAllPictures() {
	try {
		if (localDatabase != null && localDatabase.db != null) {
			var store = localDatabase.db.transaction("picture").objectStore("picture");
			var index = store.index("albumIndex");
			var range = IDBKeyRange.only(albumId);
			var request = index.openCursor(range);
			var count = 1;
			$("#singlePictureIndex").text("1");
			$("#bigPictureList").empty();
			$("#smallPictureList").empty();

			//$("#totalNumber").text(pictureNumber);
			request.onsuccess = function(evt) { 
			    var cursor = evt.target.result;
			    var bigHtml='';
			    var smallHtml='';
			    if (cursor) {
			    	var picture = cursor.value;
			    	var v = picture;
			    	//var jsonStr = JSON.stringify(album);
			    	//console.log(typeof(jsonStr))
			    	//result.innerHTML = result.innerHTML + "<br/>" + jsonStr; 
					$("#albumName").text(v.albumName);
					$("#albumNameText").text(v.albumName);
					bigHtml += '<li><div class="picimg" id="pictureBig_'+v.pictureId+'">'
						 + '<img src="'+v.pictureSrc+'" />'
						 + '</div><div class="pictxt"><h5><span>('+count+'/</span>'+'<span class=number'+albumId+'></span>)'+v.albumName+'</h5>'
		                 + '</div></li>';
					smallHtml += '<li><a href="javascript:void(0);" id="pictureSmall_'+v.pictureId+'">';
					if(count==1){
						$("#pic1").attr("src",v.pictureSrc);
						smallHtml +='<img src="'+v.pictureSrc+'" alt="" bigimg="'+v.pictureSrc+'" text="'+v.albumName+'" class="selectpic"/>';
					}else{
						smallHtml +='<img src="'+v.pictureSrc+'" alt="" bigimg="'+v.pictureSrc+'" text="'+v.albumName+'" />';
					}
					smallHtml +='</a></li>'
					$("#bigPictureList").append(bigHtml);
					$("#smallPictureList").append(smallHtml);
			        cursor.continue(); 
			        count++;
			    }else{
				    	if((count-1)===0){
				    		$("#pic1").attr("src","#");
							$("#albumDetail").html('<div class="alert alert-info" role="alert">暂无相关内容</div>');
				    	}else{
							$("#totalNumber").text(count-1);
							$('.number'+albumId).text(count-1);
						
						}
				}
			};
			
		}
	}
	catch(e){
		console.log(e);
	}
}
//删除某一记录
function deleteDataByKey(pictureId){
    var transaction=localDatabase.db.transaction('picture','readwrite'); 
    var store=transaction.objectStore('picture'); 
    var request = store.delete(pictureId);
    request.onsuccess = function(e){
    	alert("ok")
    	fetchAllPictures();
    }
}
openDatabase();
//删除单张图片
$(document).on("click",".deleteSiglePicture",function(){
	var pictureSrc = $("#pic1").attr("src");
	var smPictureSrc,id;
	$("#smallPictureList>li>a").each(function(i,v){
		smPictureSrc = $(this).find("img").attr("src");
		if(pictureSrc === smPictureSrc){
			id = $(this).attr("id").split("_")[1];
		}
	});
	var pictureId = parseInt(id);
	deleteDataByKey(pictureId);
})