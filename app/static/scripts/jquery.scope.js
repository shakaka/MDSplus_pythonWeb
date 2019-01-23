  $(document).ready(function($){
            var img_list_json = null
            var row_num= null
            var column_num=null
            var container_width =1024
            var shot= 1176
            var ISslideUp =true
            var slideUp_id =0
            var global_id =get_global_id()
            var d =new Date();
            function get_global_id(){
                 var global_id=1
                 url_temp ="get_global_id";
                 $.getJSON(url_temp, function(result){
                    global_id=result["global_id"];
                 });
                 return global_id
            };


            $(".iframe_class").slideUp();
            $("#scope_container").css({
                position : "relative",
                top: 30,
                //left: $(document).width()/2-container_width/2,
                border: "1px solid black",
            });
            $('#shot_display').text(""+shot);

            //alert(get_global_id())
            url_temp="getElements/"+get_global_id() ;

            $.getJSON(url_temp, function(result){
                //alert(result["img_list_json"][0]['pixel'][1]);
                img_list_json = result["img_list_json"];
                left_borde = parseInt($("#scope_container").offset().left);
                top_borde = 3+parseInt($("#scope_container").offset().top) ;
                container_width= $("#scope_container").width();
                column_num=0;
                for (var i = 0; i <= 3; i++) {
                        if (parseInt(img_list_json[i]['position'])< 4){
                                column_num++;
                    }
                }
                row_num=parseInt(img_list_json.length/column_num);
                    scope_container_width=parseInt((container_width)/row_num);
                    scope_container_height=parseInt(scope_container_width* 0.618);
                    image_width=scope_container_width-1;
                    image_height=scope_container_height-1;

                    $.each(img_list_json,function(i,item){

                        $("<div class=\"scopes\"  id=\"scope"+i+"\"/>").css({
                            opacity : 1,
                        position : "absolute",
                        top: 5+parseInt( parseInt(i/row_num)*(scope_container_height)),
                        left: parseInt((i-row_num*parseInt(i/row_num))*scope_container_width),
                        width: parseInt(scope_container_width),
                        height: parseInt(scope_container_height),
                        }).appendTo("#scope_container");
                        item.pixel=[image_width,image_height];
                        $("#scope"+i).prepend("<img id=\"img"+i+"\" />");
                        url_temp ="post_img/"+i;
                        if (window.console) console.log(url_temp);
                        //alert(url_temp);
                        $.ajax({
                              type : "POST",
                              url : url_temp,
                                data: JSON.stringify(item),
                                contentType: 'application/json;charset=UTF-8',
                                success: function(result) {
                                if (result) {
                                    if (window.console) console.log(JSON.stringify(result))

                                }
                              }
                        });
                        url_temp ="get_img/"+shot+"/"+global_id+"/"+ new Date().getTime()+"/"+i;
                        $("#img"+i).attr("src",url_temp)

                    });


           });


           $("#sgs_btn").on("click", function(){
                //Select global settings
                if(ISslideUp){
                        $("<div class=\"iframe_class\"  id=\"sgs_iframe\"/>").css({"z-index":10,height: 270}).insertAfter("#iframe_container");
                        url_temp="/scopeplot/scopeglobal_select";
                        $("<iframe class=\"iframe\"  id=\"iframe_sgs\"  src=\""+url_temp+"\"width=\"100%\"/>").css({"z-index":10,height: 230}).appendTo("#sgs_iframe");
                        $("<button type=\"button\" class=\"btn btn-danger btn-block\" id=\"cancel_btn\">Cancel</>").appendTo("#sgs_iframe");
                        $("#sgs_iframe").slideDown();
                        ISslideUp =false;
                        slideUp_id=1;
                        $("#iframe_sgs").on("load",function(){
                            $("#iframe_sgs").contents().find("#submit_load").on('click',function(){
                                var _global_id = $("#iframe_sgs").contents().find("#name").val();
                                //alert(_global_id+'');
                                if(_global_id!==global_id){
                                        global_id=_global_id;
                                        $("div.scopes").remove();
                                         url_temp="getElements/"+global_id;
                                         $.getJSON(url_temp, function(result){

                                          img_list_json = result["img_list_json"];
                                             if (window.console) console.log('global_POST'+JSON.stringify(img_list_json))
                                                 left_borde = parseInt($("#scope_container").offset().left);
                                                 top_borde = 3+parseInt($("#scope_container").offset().top) ;
                                                     container_width= $("#scope_container").width();
                                                    column_num=0;
                                                   for (var i = 0; i <= 3; i++) {
                                                if (parseInt(img_list_json[i]['position'])< 4){
                                                 column_num++;
                                                }
                                            }

                                        row_num=parseInt(img_list_json.length/column_num);
                                        scope_container_width=parseInt((container_width)/row_num);
                                        scope_container_height=parseInt(scope_container_width* 0.618);
                                         image_width=scope_container_width-1;
                                        image_height=scope_container_height-1;

                                         $.each(img_list_json,function(i,item){
                                            $("<div class=\"scopes\"  id=\"scope"+i+"\"/>").css({
                                                 opacity : 1,
                                                 position : "absolute",
                                                  top: 5+parseInt( parseInt(i/row_num)*(scope_container_height)),
                                                 left: parseInt((i-row_num*parseInt(i/row_num))*scope_container_width),
                                                 width: parseInt(scope_container_width),
                                                 height: parseInt(scope_container_height),
                                            }).appendTo("#scope_container");
                                            item.pixel=[image_width,image_height];
                                            $("#scope"+i).prepend("<img id=\"img"+i+"\" />");
                                             url_temp ="post_img/"+i;
                                             //if (window.console) console.log(item.pixel);
                                             if (window.console) console.log('POST'+JSON.stringify(item))
                        //alert(url_temp);
                                             $.ajax({
                                                    type : "POST",
                                                    url : url_temp,
                                                    data: JSON.stringify(item),
                                                    contentType: 'application/json;charset=UTF-8',
                                                    success: function(result) {
                                                     if (result) {
                                                        url_temp ="get_img/"+shot+"/"+global_id+"/"+new Date().getTime()+"/"+i;
                                                        $("#img"+i).attr("src",url_temp)
                                                       }
                                                     }
                                            });


                                        });

                                        });
                                }
                            });
                        });
                }
                else{
                    $("div.iframe_class").slideUp();
                   // $("div.iframe_class").empty();
                    $("div.iframe_class").remove();
                    if (slideUp_id==1){
                        ISslideUp =true;
                        slideUp_id=0;
                    }
                    else {
                        $("<div class=\"iframe_class\"  id=\"sgs_iframe\"/>").css({"z-index":10,height: 270}).insertAfter("#iframe_container");
                        url_temp="/scopeplot/scopeglobal_select";
                        $("<iframe class=\"iframe\" id=\" iframe_sgs\" src=\""+url_temp+"\"width=\"100%\"/>").css({"z-index":10,height: 230}).appendTo("#sgs_iframe");
                        $("<button type=\"button\" class=\"btn btn-danger btn-block\" id=\"cancel_btn\">Cancel</>").appendTo("#sgs_iframe");
                        $("#sgs_iframe").slideDown();
                        slideUp_id=1;
                        $("#iframe_sgs").on("load",function(){
                            $("#iframe_sgs").contents().find("#submit_load").on('click',function(){
                                    var _global_id = $("#iframe_sgs").contents().find("#name").val();
                                if(_global_id!==global_id){
                                    global_id=_global_id;
                                    $("div.scopes").remove();
                                    url_temp="getElements/"+ global_id;
                                    $.getJSON(url_temp, function(result){
                                        img_list_json = result["img_list_json"];
                                        left_borde = parseInt($("#scope_container").offset().left);
                                        top_borde = 3+parseInt($("#scope_container").offset().top) ;
                                        container_width= $("#scope_container").width();
                                        column_num=0;
                                        for (var i = 0; i <= 3; i++) {
                                            if (parseInt(img_list_json[i]['position'])< 4){
                                                 column_num++;
                                            }
                                        }
                                     row_num=parseInt(img_list_json.length/column_num);
                                    scope_container_width=parseInt((container_width)/row_num);
                                    scope_container_height=parseInt(scope_container_width* 0.618);
                                    image_width=scope_container_width-1;
                                    image_height=scope_container_height-1;

                                    $.each(img_list_json,function(i,item){
                                        $("<div class=\"scopes\"  id=\"scope"+i+"\"/>").css({
                                             opacity : 1,
                                             position : "absolute",
                                             top: 5+parseInt( parseInt(i/row_num)*(scope_container_height)),
                                             left: parseInt((i-row_num*parseInt(i/row_num))*scope_container_width),
                                             width: parseInt(scope_container_width),
                                             height: parseInt(scope_container_height),
                                        }).appendTo("#scope_container");
                                        item.pixel=[image_width,image_height];
                                        $("#scope"+i).prepend("<img id=\"img"+i+"\" />");
                                        url_temp ="post_img/"+i;
                                        if (window.console) console.log(item.pixel);
                                        $.ajax({
                                             type : "POST",
                                             url : url_temp,
                                             data: JSON.stringify(item),
                                            contentType: 'application/json;charset=UTF-8',
                                            success: function(result) {
                                                if (result) {
                                                    if (window.console) console.log(JSON.stringify(result))
                                                }
                                                }
                                        });
                                         url_temp ="get_img/"+shot+"/"+global_id+"/"+new Date().getTime()+"/"+i;
                                        $("#img"+i).attr("src",url_temp)

                                    });
                                    });
                                }
                             //alert(_global_id+'');
                            });

                        });
                    }

                }

                $("#cancel_btn").on("click", function(){
                    $("div.iframe_class").slideUp();
                    $("div.iframe_class").remove();
                    ISslideUp =true;
                    slideUp_id=0;
                });

            });





            $("#es_btn").on("click", function(){
                //Edit Settings
                if(ISslideUp){
                    $("<div class=\"iframe_class\"  id=\"es_iframe\"/>").css({"z-index":10,height: 550}).insertAfter("#iframe_container");
                    url_temp="/scopeplot/scope_select/"+global_id;
                    $("<iframe class=\"iframe\" id=\"iframe_sgs\" width=\"100%\" src=\""+url_temp+ "\" />").css({"z-index":10,height: 510}).appendTo("#es_iframe");
                    $("<button type=\"button\" class=\"btn btn-danger btn-block\" id=\"cancel_btn\">Cancel</>").appendTo("#es_iframe");
                    $("#es_iframe").slideDown();
                    ISslideUp =false;
                    slideUp_id=2;
                    var page_flag=0//which page is selected?
                    var scope_id_selected
                    var scope_index=1
                    $("#iframe_sgs").on("load",function(){
                            $("#iframe_sgs").contents().find("#submit").on('click',function(){
                                if (page_flag==0) {
                                    page_flag=1;
                                    scope_id_selected=$("#iframe_sgs").contents().find("#scope_id").val();
                                    if (window.console) console.log(scope_id_selected);
                                }
                                else{
                                    page_flag=0;
                                    $.each(img_list_json,function(i,item){
                                        if (item.id==scope_id_selected) {
                                            item.title=$("#iframe_sgs").contents().find("#title").val();
                                            item.x_data_source=$("#iframe_sgs").contents().find("#x_data_source").val();
                                            item.y_data_source=$("#iframe_sgs").contents().find("#y_data_source").val();
                                            item.line_style = parseInt($("#iframe_sgs").contents().find("#line_style").val());
                                            item.line_color =parseInt($("#iframe_sgs").contents().find("#line_color").val());
                                            if (window.console) console.log(item.line_style);
                                              if (window.console) console.log(item.line_color);
                                            url_temp ="post_img/"+i;
                                            $.ajax({
                                                type : "POST",
                                                url : url_temp,
                                                data: JSON.stringify(item),
                                                contentType: 'application/json;charset=UTF-8',
                                                success: function(result) { }
                                            });
                                            url_temp ="get_img/"+shot+"/"+global_id+"/"+new Date().getTime()+"/"+i;
                                            $("#img"+i).attr("src",url_temp);
                                            if (window.console) console.log(url_temp);

                                        }
                                    });

                                }
                            });

                    });

                }
                else{
                    $("div.iframe_class").slideUp();
                    //$("div.iframe_class").empty();
                    $("div.iframe_class").remove();
                    if (slideUp_id==2) {
                        slideUp_id=0;
                        ISslideUp =true;
                    }
                    else{

                        $("<div class=\"iframe_class\"  id=\"es_iframe\"/>").css({"z-index":10,height: 550}).insertAfter("#iframe_container");
                        url_temp="/scopeplot/scope_select/"+global_id;
                        $("<iframe class=\"iframe\" id=\"iframe_sgs\" width=\"100%\" src=\""+url_temp+ "\" />").css({"z-index":10,height: 510}).appendTo("#es_iframe");
                        $("<button type=\"button\" class=\"btn btn-danger btn-block\" id=\"cancel_btn\">Cancel</>").appendTo("#es_iframe");
                        $("#es_iframe").slideDown();
                        //ISslideUp =false;
                        slideUp_id=2;
                        var page_flag=0//which page is selected?
                    var scope_id_selected
                    var scope_index=1
                    $("#iframe_sgs").on("load",function(){
                            $("#iframe_sgs").contents().find("#submit").on('click',function(){
                                if (page_flag==0) {
                                    page_flag=1;
                                    scope_id_selected=$("#iframe_sgs").contents().find("#scope_id").val();
                                    if (window.console) console.log(scope_id_selected);
                                }
                                else{
                                    page_flag=0;
                                    $.each(img_list_json,function(i,item){
                                        if (item.id==scope_id_selected) {
                                            item.title=$("#iframe_sgs").contents().find("#title").val();
                                            item.x_data_source=$("#iframe_sgs").contents().find("#x_data_source").val();
                                            item.y_data_source=$("#iframe_sgs").contents().find("#y_data_source").val();
                                            item.line_style = parseInt($("#iframe_sgs").contents().find("#line_style").val());
                                            item.line_color = parseInt($("#iframe_sgs").contents().find("#line_color").val());
                                            if (window.console) console.log(item.line_style);
                                            url_temp ="post_img/"+i;
                                            $.ajax({
                                                type : "POST",
                                                url : url_temp,
                                                data: JSON.stringify(item),
                                                contentType: 'application/json;charset=UTF-8',
                                                success: function(result) { }
                                            });
                                            url_temp ="get_img/"+shot+"/"+global_id+"/"+new Date().getTime()+"/"+i;
                                            $("#img"+i).attr("src",url_temp);
                                            if (window.console) console.log(url_temp);

                                        }
                                    });

                                }
                            });

                    });
                    }
                }
                $("#cancel_btn").on("click", function(){
                $("div.iframe_class").slideUp();
                $("div.iframe_class").remove();
                ISslideUp =true;
                slideUp_id=0;
                });


            });

            $("#cgs_btn").on("click", function(){
                //Create global settings
                if (ISslideUp) {

                    $("<div class=\"iframe_class\"  id=\"cgs_iframe\"/>").css({"z-index":10,height: 420,}).insertAfter("#iframe_container");
                    url_temp="/scopeplot/scopeglobal_create";
                    $("<iframe class=\"iframe\" src=\" "+ url_temp+"\"width=\"100%\"/>").css({"z-index":10,width:"00%",height: 380}).appendTo("#cgs_iframe");
                    $("<button type=\"button\" class=\"btn btn-danger btn-block\" id=\"cancel_btn\">Cancel</>").appendTo("#cgs_iframe");
                    $("#cgs_iframe").slideDown();
                    ISslideUp =false;
                    slideUp_id=3;
                }
                else{
                    $("div.iframe_class").slideUp();
                    //$("div.iframe_class").empty();
                    $("div.iframe_class").remove();
                    if (slideUp_id==3) {
                        slideUp_id=0;
                        ISslideUp =true;
                    }
                    else{
                        $("<div class=\"iframe_class\"  id=\"cgs_iframe\"/>").css({"z-index":10,height: 420}).insertAfter("#iframe_container");
                         url_temp="/scopeplot/scopeglobal_create";
                        $("<iframe class=\"iframe\" src=\""+url_temp+"\"width=\"100%\"/>").css({"z-index":10,height: 380,}).appendTo("#cgs_iframe");
                        $("<button type=\"button\" class=\"btn btn-danger btn-block\" id=\"cancel_btn\">Cancel</>").appendTo("#cgs_iframe");
                        $("#cgs_iframe").slideDown();
                        //ISslideUp =false;
                        slideUp_id=3;
                    }

                }
                $("#cancel_btn").on("click", function(){
                $("div.iframe_class").slideUp();
                $("div.iframe_class").remove();
                ISslideUp =true;
                slideUp_id=0;
            });



            });
            $("#scs_btn").on("click", function(){
                //Save current settings
                if (ISslideUp) {
                    $("<div class=\"iframe_class\"  id=\"scs_iframe\"/>").css({"z-index":10,height: 270}).insertAfter("#iframe_container");
                    url_temp="/scopeplot/scopeglobal_save/"+global_id;
                    $("<iframe id=\"iframe_scs\" src="+url_temp+" width=\"100%\"/>").css({"z-index":10,height:230}).appendTo("#scs_iframe");
                    $("<button type=\"button\" class=\"btn btn-danger btn-block\" id=\"cancel_btn\">Cancel</>").appendTo("#scs_iframe");
                    $("#scs_iframe").slideDown();
                    ISslideUp =false;
                    slideUp_id=4
                    slideUp_id=4;


                }
                else{
                    $("div.iframe_class").slideUp();
                    //$("div.iframe_class").empty();
                    $("div.iframe_class").remove();
                    if (slideUp_id==4) {
                        slideUp_id=0;
                        ISslideUp =true;
                    }
                    else{
                        $("<div class=\"iframe_class\"  id=\"scs_iframe\"/>").css({"z-index":10,height: 270}).insertAfter("#iframe_container");
                        url_temp="/scopeplot/scopeglobal_save/"+global_id;
                        $("<iframe id=\"iframe_scs\" src="+url_temp+" width=\"100%\"/>").css({"z-index":10,height:230}).appendTo("#scs_iframe");
                        $("<button type=\"button\" class=\"btn btn-danger btn-block\" id=\"cancel_btn\">Cancel</>").appendTo("#scs_iframe");
                        $("#scs_iframe").slideDown();
                        //ISslideUp =false;
                        slideUp_id=4;


                         }}

                $("#cancel_btn").on("click", function(){
                         $("div.iframe_class").slideUp();
                         $("div.iframe_class").remove();
                         ISslideUp =true;
                        slideUp_id=0;
                });


            });




            $("#Zoom").on("click", function(){


                $("div.vline").remove();
                $("div.image_overlay").remove();


                $.each(img_list_json,function(i,item){

                              $('img#img'+i).selectAreas({
                                    off_img_x: item.x_offset,
                                    off_img_y: item.y_offset,
                                    onChanged: Zoom_callback,
                                    areas: [] ,
                                    allowSelect:true,

                          });

                            function Zoom_callback (event, id, areas) {
                                    if (areas[id]==undefined){return;}
                                    x_range_temp=[0,0];
                                    y_range_temp=[0,0];
                                    x_range_temp[0]= (areas[id].x-item.x_offset[0])*(item.x_range[1]-item.x_range[0])/(item.pixel[0]-item.x_offset[0]-item.x_offset[1]) + item.x_range[0];
                                    x_range_temp[1]=(areas[id].x+ areas[id].width -item.x_offset[0])*(item.x_range[1]-item.x_range[0])/(item.pixel[0]-item.x_offset[0]-item.x_offset[1]) + item.x_range[0];
                                    y_range_temp[0]=(areas[id].y+areas[id].height-item.y_offset[0])*(item.y_range[0]-item.y_range[1])/(item.pixel[1]-item.y_offset[0]-item.y_offset[1])+item.y_range[1];
                                    y_range_temp[1]=(areas[id].y-item.y_offset[0])*(item.y_range[0]-item.y_range[1])/(item.pixel[1]-item.y_offset[0]-item.y_offset[1])+item.y_range[1];
                                    item.x_range=x_range_temp;
                                    item.y_range=y_range_temp;
                                //alert('x:'+ item.x_range[0]+ ','+item.x_range[1]+ '    y:' +item.y_range[0]+' , '+item.y_range[1]);
                        //$("div.select-areas-outline").remove();
                        url_temp ="post_img/"+i;
                        $.ajax({
                            type : "POST",
                            url : url_temp,
                            data: JSON.stringify(item),
                            contentType: 'application/json;charset=UTF-8',
                            success: function(result) { }
                        });
                       url_temp ="get_img/"+shot+"/"+global_id+"/"+new Date().getTime()+"/"+i;
                        $("#img"+i).attr("src",url_temp);
                        $("#img"+i).selectAreas('remove',id);
                            };
                    });

              });

            $("#Load").on("click", function(){
                     url_temp="get_list";
                     $.getJSON(url_temp, function(result){
                                    img_list_json = result["img_list_json"];
                                    if (window.console) console.log(JSON.stringify(img_list_json));
                        });
                     $("#Point").removeAttr("disabled");
                     $("#Zoom").removeAttr("disabled");
                     $("#Test").removeAttr("disabled");

            });


            $("#apply_btn").on("click", function(){

                shot_str=$('#shot_input').val();
                plus_index =shot_str.indexOf('+')
                minus_index=shot_str.indexOf('-')
                var shot = -1
                if (plus_index!=shot_str.lastIndexOf('+')||minus_index!=shot_str.lastIndexOf('-')) {
                        alert('Format error!')

                }

                if (plus_index==-1 && minus_index==-1) {
                        shot=parseInt(shot_str);
                        url_temp ="check_shot_num/"+shot;
                        $.getJSON(url_temp, function(result){
                            if(result["check_shot_num"]==-1){
                                alert('Shot number does not exist!');
                                return;
                            }
                            else{
                                shot= result["check_shot_num"]
                            }
                        });
                }
                else if(plus_index!==-1 && minus_index==-1){
                        sub_str=shot_str.split('+')
                        shot=parseInt(sub_str[0])+parseInt(sub_str[1]);
                }

                else if(plus_index==-1 && minus_index!==-1){
                        sub_str=shot_str.split('-')
                        shot=parseInt(sub_str[0])-parseInt(sub_str[1]);
                }
                else{
                        alert('Format complicated!');
                        return;
                }


                $('#shot_display').text(""+shot);
                $.each(img_list_json,function(i,item){

                        url_temp ="get_img/"+shot+"/"+global_id+"/"+new Date().getTime()+"/"+i;

                        $("#img"+i).attr("src",url_temp)

                });
            });







            $("#Point").on("click", function(){
                  $("div.image_overlay").remove();


                    $.each(img_list_json,function(i,item){

                    $('img#img'+i).selectAreas('destroy');

                    $("<div class=\"image_overlay\"  id= \"image_overlay"+i+"\" /div>").css({
                        opacity : 1,
                        position : "absolute",
                        top: 0,
                        left: 0,
                        width: $('#img'+i).width(),
                        height: $('#img'+i).height(),
                      }).insertAfter('#img'+i);
                     });

                $.each(img_list_json,function(i,item){

                  $("#image_overlay"+i).mousedown(function(e){
                    var isMove = true;
                      var right_borde = $('#image_overlay'+i).width()-item.x_offset[1];
                      var left_borde = item.x_offset[0];
                      var top_borde= item.y_offset[0];
                      var buttom_borde=$('#image_overlay'+i).height()-item.y_offset[1];
                              var xx= e.pageX-$("#image_overlay"+i).offset().left;
                    xx=( xx > right_borde) ? right_borde : (xx<left_borde )? left_borde : xx;
                      x_value =(xx- item.x_offset[0])* (item.x_range[1]-item.x_range[0])/(item.pixel[0]-item.x_offset[0]-item.x_offset[1]) + item.x_range[0];
                      $("div.vline").remove();
                      $('#image_overlay'+i).vline(xx, top_borde, buttom_borde, {color:"black", style: "solid",stroke: "1"});
                    $.each(img_list_json,function(j,_item){
                            if(j!=i){
                                _xx =(x_value<_item.x_range[0])? _item.x_offset[0] :(x_value>_item.x_range[1])? _item.x_offset[0]:(_item.pixel[0]-_item.x_offset[0]-_item.x_offset[1])*(x_value-_item.x_range[0])/(_item.x_range[1]-_item.x_range[0])+_item.x_offset[0];
                                  var _top_borde= _item.y_offset[0];
                                  var _buttom_borde=$('#image_overlay'+j).height()-_item.y_offset[1];
                                   $('#image_overlay'+j).vline(_xx, _top_borde, _buttom_borde, {color:"black", style: "solid",stroke: "1"});
                            };
                      });

                    $(document).mousemove(function (e){
                        if(isMove){
                              var xx= e.pageX-$("#image_overlay"+i).offset().left;
                                xx=( xx > right_borde) ? right_borde : (xx<left_borde )? left_borde : xx
                                x_value =(xx-item.x_offset[0])*(item.x_range[1]-item.x_range[0])/(item.pixel[0]-item.x_offset[0]-item.x_offset[1]) + item.x_range[0];
                                $("div.vline").remove();
                                $('#image_overlay'+i).vline(xx, top_borde, buttom_borde, {color:"black", style: "solid",stroke: "1"});
                              $.each(img_list_json,function(j,_item){
                                      if(j!=i){

                                            _xx =(x_value<_item.x_range[0])? _item.x_offset[0] :(x_value>_item.x_range[1])? _item.x_offset[0]:(_item.pixel[0]-_item.x_offset[0]-_item.x_offset[1])*(x_value-_item.x_range[0])/(_item.x_range[1]-_item.x_range[0])+_item.x_offset[0];
                                            var _top_borde= _item.y_offset[0];
                                            var _buttom_borde= $('#image_overlay'+j).height()-_item.y_offset[1];
                                            $('#image_overlay'+j).vline(_xx,_top_borde,_buttom_borde,{color:"black",style:"solid",stroke:"1"});
                                      };
                                });
                        };
                    }).mouseup(function () { isMove = false; });

                    });
                });
            });

    });
