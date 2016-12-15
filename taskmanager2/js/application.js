var TASKMAN=TASKMAN||{user:function(a,b,c,d,e){this.id=a,this.fullname=b,this.user=c,this.password=d,this.type=e},client:function(a,b,c,d){this.id=a,this.fullname=b,this.clientid=c,this.phone=d},invoice:function(a,b,c,d,e){this.id=a,this.clientid=b,this.description=c,this.date=d,this.price=e},task:function(a,b,c,d){this.id=a,this.clientid=b,this.date=c,this.notes=d},storage:{init:function(){localStorage.users||(localStorage.users=JSON.stringify(new Array(new TASKMAN.user(0,"Administrator","admin","$uper4dmin",0))))},queries:{insert:function(a){if(void 0!==a){var b=TASKMAN.utils.getObjectName(a)+"s";if("s"!=b){if(localStorage[b]){var d=TASKMAN.storage.queries.select(b);d.push(a),localStorage[b]=JSON.stringify(d)}else{var c=[a];localStorage[b]=JSON.stringify(c)}$("#records").empty(),TASKMAN.utils.printInPage(),$("#newModal").closeModal(),Materialize.toast("New "+b.substring(0,b.length-1)+" created successfully!",2500),("invoices"==b||"tasks"==b)&&TASKMAN.utils.skrinkIfTheresNoRoom()}else $("#newModal input").filter(function(){return""==this.value}).addClass("invalid")}},select:function(a){return localStorage[a]?JSON.parse(localStorage[a]):!1},update:function(a){if(a)for(var b=TASKMAN.utils.getNameOfCurrentPage(),c=TASKMAN.storage.queries.select(b),d=0;d<c.length;d++)if(c[d].id==a.id)return c[d]=a,localStorage[b]=JSON.stringify(c),$("#records").empty(),TASKMAN.utils.printInPage(),$("#editModal").closeModal(),Materialize.toast("A "+b.substring(0,b.length-1)+" has been edited!",2500),("invoices"==b||"tasks"==b)&&TASKMAN.utils.skrinkIfTheresNoRoom(),void 0},"delete":function(a,b){for(var c=TASKMAN.storage.queries.select(b),d=0;d<c.length;d++)if(a==c[d].id)return c.splice(d,1),localStorage[b]=JSON.stringify(c),$("#records").empty(),TASKMAN.utils.printInPage(),Materialize.toast("A "+b.substring(0,b.length-1)+" has been deleted successfully!",2500),void 0;("invoices"==collection||"tasks"==collection)&&TASKMAN.utils.skrinkIfTheresNoRoom()}}},utils:{getNextIndexOf:function(a){var b=TASKMAN.storage.queries.select(a);return b&&0!=b.length?(b.sort(),parseInt(b[b.length-1].id)+1):0},getObjectName:function(a){return a.password?"user":a.phone?"client":a.price?"invoice":a.notes?"task":""},getModalOpened:function(){for(var a=$(".modal"),b=0;b<a.length;b++)if("block"==a[b].style.display)return a[b].id},checkLoggedInUser:function(){sessionStorage.userLogged||window.location.replace("index.html")},showUsername:function(){$("#userlogged").html(JSON.parse(sessionStorage.userLogged).user)},showEditModal:function(a){$("#editModal #password").attr("placeholder","Password...");for(var b=TASKMAN.storage.queries.select(TASKMAN.utils.getNameOfCurrentPage()),c=0;c<b.length;c++)if(b[c].id==a){$("#objectID").html(a);for(var d=1;d<Object.keys(b[c]).length;d++)"admin"==$(".modal input")[d].id?$("#editModal .modal-content input#adminedit")[0].checked=!b[c].type:$("#editModal #"+$(".modal input")[d].id).val(b[c][$(".modal input")[d].id])}$("#editModal").openModal()},wrapIntoObject:function(){var c,d,a=TASKMAN.utils.getNameOfCurrentPage(),b=$("#"+TASKMAN.utils.getModalOpened()+" input");if(d=b.selector.indexOf("editModal")>0?$("#objectID").html():TASKMAN.utils.getNextIndexOf(a),TASKMAN.utils.passwordReEnter(d,b[2].value)){if("clients"==a)c=new TASKMAN.client(d,b[0].value,b[1].value,b[2].value);else if("invoices"==a)c=new TASKMAN.invoice(d,b[0].value,b[1].value,b[2].value,b[3].value);else if("tasks"==a)c=new TASKMAN.task(d,b[0].value,b[1].value,b[2].value);else if("users"==a){var e;e=b[b.length-1].checked?0:1,c=new TASKMAN.user(d,b[0].value,b[1].value,b[2].value,e)}return $(".modal input").val(""),c}},printInPage:function(){var a=TASKMAN.storage.queries.select(TASKMAN.utils.getNameOfCurrentPage());if(0!=a.length&&a){$("#no-records").hide();var c,d,b="material-icons";a[0].fullname?(c=1,d="account_circle"):a[0].description?(c=2,d="description"):a[0].notes&&(c=3,d="assignment");var e=document.createElement("ul");e.setAttribute("data-collapsible","accordion"),e.className="collapsible popout",e.id="accordion";var f;for("users"==TASKMAN.utils.getNameOfCurrentPage()&&"1"==JSON.parse(sessionStorage.userLogged).type?(a[0]=JSON.parse(sessionStorage.userLogged),f=a.length-1):f=0;f<a.length;f++){var g=document.createElement("li"),h=document.createElement("div");h.className="collapsible-header",h.innerHTML=c>1?TASKMAN.utils.shortenName(a[f][Object.keys(a[f])[c]],a[f][Object.keys(a[f])[1]]):a[f][Object.keys(a[f])[c]];var i=document.createElement("i");i.className=b,i.innerHTML=d,h.appendChild(i);var j=document.createElement("div");j.className="collapsible-body";var k=document.createElement("div");k.className="info";var l=document.createElement("div");l.className="actions";for(var m=1;m<Object.keys(a[f]).length;m++){var n=document.createElement("p");n.innerHTML=a[f][Object.keys(a[f])[m]];var o=document.createElement("i");o.className=b+" prefix";var p;switch(Object.keys(a[f])[m]){case"fullname":p="account_circle";break;case"clientid":p="person_pin";break;case"date":p="today";break;case"price":p="attach_money";break;case"notes":p="reorder";break;case"user":p="face";break;case"password":p="vpn_key",n.innerHTML=n.innerHTML.replace(/./gi,"*");break;case"type":p="perm_identity","0"==n.innerHTML?(n.style="color: blue;",n.innerHTML="Granted administrator privilegies."):(n.style="color: red",n.innerHTML="No administrator privilegies granted.");break;default:p=Object.keys(a[f])[m]}o.innerHTML=p,n.insertBefore(o,n.childNodes[0]),k.appendChild(n)}var l=document.createElement("div");l.className="actions";var q=document.createElement("i");if(q.setAttribute("onclick","TASKMAN.utils.showEditModal("+a[f][Object.keys(a[f])[0]]+")"),q.innerHTML="create",q.className=b,l.appendChild(q),"users"!=TASKMAN.utils.getNameOfCurrentPage()||!(0!=a[f].id^a[f].id!=JSON.parse(sessionStorage.userLogged).id)){var r=document.createElement("i");r.setAttribute("onclick","TASKMAN.storage.queries.delete("+a[f].id+', "'+TASKMAN.utils.getNameOfCurrentPage()+'")'),r.innerHTML="delete",r.className=b,l.appendChild(r)}k.appendChild(l),j.appendChild(k),g.appendChild(h),g.appendChild(j),e.appendChild(g)}document.getElementById("records").appendChild(e),$(".collapsible").collapsible()}else $("#no-records").show()},fillClientSelect:function(){for(var a=TASKMAN.storage.queries.select("clients"),b=0;b<a.length;b++)$("select").append($("<option>",{value:a[b].id,text:a[b].fullname}));$("select").material_select(),$(".modal-content").find(".input-field").find("span.caret").not(".select-wrapper span.caret").hide();for(var b=0;b<$("input.select-dropdown").length;b++)$("input.select-dropdown")[b].id="clientid"},checkInputs:function(){var a=$("#"+TASKMAN.utils.getModalOpened()+" input").not("#adminedit").filter(function(){return""==this.value||"Select client..."==this.value});return a.addClass("invalid"),$("#"+TASKMAN.utils.getModalOpened()+" input").not(a).removeClass("invalid"),a.length>0},addValidations:function(){$(".modal .input-field input").bind("input",function(){"clientid"==$(this)[0].id||"phone"==$(this)[0].id||"price"==$(this)[0].id?isNaN($(this).val())?($(this).addClass("invalid"),$(this).parent().parent().parent().find(".waves-green").addClass("disabled-link disabled")):($(this).removeClass("invalid"),$(this).parent().parent().parent().find(".waves-green").removeClass("disabled-link disabled")):TASKMAN.utils.checkInputs()?$(this).parent().parent().parent().find(".waves-green").addClass("disabled-link disabled"):$(this).parent().parent().parent().find(".waves-green").removeClass("disabled-link disabled")})},passwordReEnter:function(a,b){return"users"==TASKMAN.utils.getNameOfCurrentPage()?TASKMAN.utils.getUserbyID(a).password==b&&TASKMAN.utils.getUserbyID(a).password?!0:"Password..."==$("#"+TASKMAN.utils.getModalOpened()+" #password").attr("placeholder")?(TASKMAN.passwordToCompare=$("#"+TASKMAN.utils.getModalOpened()+" #password").val(),$("#"+TASKMAN.utils.getModalOpened()+" #password").attr("placeholder","Please re-enter the password"),$("#"+TASKMAN.utils.getModalOpened()+" #password").val(""),!1):TASKMAN.passwordToCompare!=$("#"+TASKMAN.utils.getModalOpened()+" #password").val()?($("#"+TASKMAN.utils.getModalOpened()+" #password").attr("placeholder","Password..."),$("#"+TASKMAN.utils.getModalOpened()+" #password").val(""),$("#"+TASKMAN.utils.getModalOpened()+" #password").addClass("tooltipped invalid"),$("#"+TASKMAN.utils.getModalOpened()+" #password").attr("data-position","bottom"),$("#"+TASKMAN.utils.getModalOpened()+" #password").attr("data-delay","50"),$("#"+TASKMAN.utils.getModalOpened()+" #password").attr("data-tooltip","Passwords mismatch!"),$(".tooltipped").tooltip({delay:50}),!1):($("#"+TASKMAN.utils.getModalOpened()+" #password").attr("placeholder","Password..."),TASKMAN.passwordToCompare="",!0):!0},getUserbyID:function(a){for(var b=TASKMAN.storage.queries.select("users"),c=0;c<b.length;c++)if(b[c].id==a)return b[c];return!1},getNameOfCurrentPage:function(){var a=$(".modal input");return a.context.URL.split("/").slice(-1)[0].substring(0,$(".modal input").context.URL.split("/").slice(-1)[0].indexOf("."))},shortenName:function(a,b){var d=b.split(" ");return d.length>1&&(b=d[0].substring(0,1)+". "+d[1]),a.length>10&&(a=a.substring(0,10)+"..."),a+" - "+b},skrinkIfTheresNoRoom:function(){$(".collapsible-header").not("i").length>0&&$(".collapsible-header").not("i").html().indexOf("...")>-1&&$(".collapsible-header").not("i").css("font-size","0.8em")}},login:function(a,b){for(var c=TASKMAN.storage.queries.select("users"),d=0;d<c.length;d++)if(a==c[d].user&&b==c[d].password)return $("#loginmodal").closeModal(),sessionStorage.userLogged=JSON.stringify(c[d]),window.location.replace("main.html"),$("#remember")[0].checked&&(localStorage.remembered=sessionStorage.userLogged),void 0;$("#error").css("display","block")},logout:function(){sessionStorage.userLogged=!1,window.location.replace("index.html")},passwordToCompare:""};TASKMAN.storage.init();