$(document).ready(function($){

    var shot= 170512049
    var num_frames=5
    var img_list = null
    var pixel = [0,0]
    var auto_slide = false
    var sptm_con = {"HR+D0645": 0, "HR+D0476": 0, "HR+D0493": 0}
    var is_gakki= true

    $('#wl_indicator').fadeOut();
    
    $("#viewCarousel").carousel();
    $("#viewCarousel").carousel("cycle");
    gakki_img(num_frames);
    auto_slide=true;
    $('#shot_display').text(""+shot);
    setInterval(function(){
        var url_temp="/oceanview/get_sptm_con/";
        $.getJSON(url_temp, function(result){
            sptm_con = result["sptm_con"];
            if (sptm_con["HR+D0476"]){
                $("#HRD0476").addClass("btn-primary")
            }
            else{
                $("#HRD0476").removeClass("btn-primary")
            }
            if (sptm_con["HR+D0645"]){
                $("#HRD0645").addClass("btn-warning")
            }
            else{
                $("#HRD0645").removeClass("btn-warning")
            }
            if (sptm_con["HR+D0493"]){
                $("#HRD0493").addClass("btn-danger")
            }
            else{
                $("#HRD0493").removeClass("btn-danger")
            }

        });

    }, 5000);


    $(window).resizeend(2000, function(e) {
		if(!is_gakki){
            update_img(num_frames)
            $("div.vline").remove();
            $("div.image_overlay").remove();
            //$('img').selectAreas('destroy');
            $('div.trigger-layer').remove();
            $('div.select-areas-overlay').remove();
            $('img').selectAreas('destroy');
            $("#Zoom").attr("disabled", true);
            $("#Point").attr("disabled", true);
            $("#Reset").attr("disabled", true);
            $("#Reset_All").attr("disabled", true);
        }
	});


    $("#apply_btn").on("click", function(){
        $("div.vline").remove();
        $("div.image_overlay").remove();
        function trans_shot(){
            shot_str=$('#shot_input').val();
            //if (window.console) console.log(shot_str);
            if (shot_str.length == 0){
                alert('Shot num is none!');
                return null;
            }
            plus_index  = shot_str.indexOf('+');
            minus_index = shot_str.indexOf('-');

            if (plus_index!=shot_str.lastIndexOf('+')||minus_index!=shot_str.lastIndexOf('-')) {
            alert('Format error!');
                return null;
            }
            if (plus_index==-1 && minus_index==-1) {
                 return parseInt(shot_str);


            }

            else if(plus_index!==-1 && minus_index==-1){
                sub_str=shot_str.split('+');
                return parseInt(sub_str[0]) + parseInt(sub_str[1]);
            }

            else if(plus_index==-1 && minus_index!==-1){
                sub_str=shot_str.split('-');
                return parseInt(sub_str[0]) - parseInt(sub_str[1]);
            }
            else{
                alert('Format complicated!');
                return null;
            }
        }

        if (trans_shot()){
            shot=trans_shot()
            url_temp ="/oceanview/check_shot_num/"+shot;
            $.getJSON(url_temp, function(result){
            if(result["check_shot_num"]==-1){
                alert('Shot number does not exist!');
                return;
            }

            else{
                shot= result["check_shot_num"]
                url_temp1 ="/oceanview/get_frames_num/"+shot;
                $.getJSON(url_temp1, function(result){
                    if(result["frames_num"]==0){
                        alert('There is no data stored for this shot!');
                        return;
                    }
                    else{
                        num_frames= result["frames_num"];
                        update_img(num_frames);
                        $("#Zoom").attr("disabled", true);
                        $("#Point").attr("disabled", true);
                        $("#Reset").attr("disabled", true);
                        $("#Reset_All").attr("disabled", true);
                    }
                });
            $('#shot_display').text(""+shot);
            $("#Loading").text("");
            }
        });
        }
    });

    $("#Load").on("click", function(){
        $("div.vline").remove();
        $("div.image_overlay").remove();
        url_temp="/oceanview/get_list";
        $.getJSON(url_temp, function(result){
        img_list = result["img_list"];
        //if (window.console) console.log(JSON.stringify(img_list));
        $("#Point").removeAttr("disabled");
        $("#Zoom").removeAttr("disabled");

        });
    });
    
    $("#Reset").on("click", function(){
        $("div.vline").remove();
        $("div.image_overlay").remove();
        var item = img_list[active_item()];
        item.x_range=[0,0]
        item.y_range=[0,0]
        url_temp ="/oceanview/post_img/"+active_item();
        //$.ajaxSettings.async = false;
        $.ajax({
            type : "POST",
            url : url_temp,
            data: JSON.stringify(item),
            contentType: 'application/json;charset=UTF-8',
            success: function(result) {
                url_temp ="/oceanview/get_img/"+shot+"/"+new Date().getTime()+"/"+active_item();
                try{
                    $("#img"+active_item()).attr("src",url_temp);    
                }
                catch(err){
                    try{
                            $("#img"+active_item()).attr("src",url_temp);       
                    }
                    finally{

                    }
                }
                finally{
                    $("#img"+active_item()).ready(function(){
                        url_temp1="/oceanview/get_list_item/"+active_item();
                        $.getJSON(url_temp1, function(result){
                            img_list[active_item()] = result["img_list_item"];
                        });
                    });

                }
                

            }
        });
        //$.ajaxSettings.async = true;
    });

    $("#Reset_All").on("click", function(){
        $("div.vline").remove();
        $("div.image_overlay").remove();
        $.each(img_list,function(i,item){

            item.x_range=[0,0]
            item.y_range=[0,0]
            url_temp ="/oceanview/post_img/"+i;
        //$.ajaxSettings.async = false;
            $.ajax({
                type : "POST",
                url : url_temp,
                data: JSON.stringify(item),
                contentType: 'application/json;charset=UTF-8',
                success: function(result) {
                    url_temp ="/oceanview/get_img/"+shot+"/"+new Date().getTime()+"/"+i;
                    try{
                        $("#img"+i).attr("src",url_temp);
                    }
                    catch(err){
                        try{
                            $("#img"+i).attr("src",url_temp);
                        }
                        finally{
                        }
                    }
                    finally{
                        $("#Zoom").attr("disabled", true);
                        $("#Point").attr("disabled", true);
                        $("#Reset").attr("disabled", true);
                        $("#Reset_All").attr("disabled", true);
                    }
                }
            });

        });


        //$.ajaxSettings.async = true;
    });

    $("#Slide").on("click", function(){
        if (auto_slide){
            $("#viewCarousel").carousel("pause");
            auto_slide = false;
            $("#Slide").text("Cycle")
            if (window.console) console.log("pause");
        }
        else{
            $("#viewCarousel").carousel("cycle");
            $('#wl_indicator').fadeOut();
            $("div.image_overlay").remove();
            $('div.trigger-layer').remove();
            $('div.select-areas-overlay').remove();
            $('img').selectAreas('destroy');
            $("div.vline").remove();
            auto_slide = true;
            $("#Slide").text("Pause")
            if (window.console) console.log("cycle");
        }
    });

    $("#left_prev").click(function(){
        $("#viewCarousel").carousel("prev");
        $('div.trigger-layer').remove();
        $('div.select-areas-overlay').remove();
        $('img').selectAreas('destroy');
        $("div.vline").remove();
        $("div.image_overlay").remove();
    })

    $("#right_next").click(function(){
        $("#viewCarousel").carousel("next");
        $('div.trigger-layer').remove();
        $('div.select-areas-overlay').remove();
        $('img').selectAreas('destroy');
        $("div.vline").remove();
        $("div.image_overlay").remove();
    })


    $("#Point").on("click", function(){
        $('#wl_indicator').fadeIn();
        $("#viewCarousel").carousel("pause");
        auto_slide = false;
        $("#Slide").text("Cycle")
        $("div.image_overlay").remove();
        $('div.trigger-layer').remove();
        $('div.select-areas-overlay').remove();
        $('img').selectAreas('destroy');
        
        $("<div class=\"image_overlay\"  id= \"image_overlay\" /div>").css({
            opacity : 1,
            position : "absolute",
            top: 0,
            left: 0,
            width: $('#img'+active_item()).width(),
            height: $('#img'+active_item()).height(),
        }).insertAfter('#carl_inner');
            
        $("#image_overlay").mousedown(function(e){
            var item = img_list[active_item()];
            var isMove = true;
            var right_border= $('#image_overlay').width()-item.x_offset[1];
            var left_border = item.x_offset[0];
            var top_border  = item.y_offset[0];
            var bottom_border =$('#image_overlay').height()-item.y_offset[1];
            var xx= e.pageX-$("#image_overlay").offset().left;
            xx=( xx > right_border) ? right_border: (xx<left_border)? left_border: xx;
            x_value =(xx- item.x_offset[0])* (item.x_range[1]-item.x_range[0])/(item.pixel[0]
                -item.x_offset[0]-item.x_offset[1]) + item.x_range[0];
            $('#wavelength').text(x_value.toFixed(4)+'nm');
            $("div.vline").remove();
            $('#image_overlay').vline(xx, top_border, bottom_border, {color:"black", style: "solid",stroke: "1"});



        $(document).mousemove(function (e){
            var item =img_list[active_item()];
            if(isMove){
                var xx= e.pageX-$("#image_overlay").offset().left;
                    xx=( xx > right_border) ? right_border: (xx<left_border)? left_border: xx
                    x_value =(xx-item.x_offset[0])*(item.x_range[1]-item.x_range[0])/(item.pixel[0]-item.x_offset[0]-item.x_offset[1]) + item.x_range[0];
                    $('#wavelength').text(x_value.toFixed(4)+'nm');
                    $("div.vline").remove();
                    $('#image_overlay').vline(xx, top_border, bottom_border, {color:"black", style: "solid",stroke: "1"});
            };
            }).mouseup(function () { isMove = false; });


        

        });
    });

    $("#Zoom").on("click", function(){
        $('#wl_indicator').fadeOut();
        $("#viewCarousel").carousel("pause");
        auto_slide = false;
        $("#Slide").text("Cycle")
        $("div.vline").remove();
        $("div.image_overlay").remove();
        
        var item = img_list[active_item()];
        $('img#img'+active_item()).selectAreas({
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
            x_range_temp[0]= (areas[id].x-item.x_offset[0])*(item.x_range[1]-item.x_range[0])
                    /(item.pixel[0]-item.x_offset[0]-item.x_offset[1]) + item.x_range[0];
            x_range_temp[1]=(areas[id].x+ areas[id].width -item.x_offset[0])*(item.x_range[1]
                    -item.x_range[0])/(item.pixel[0]-item.x_offset[0]-item.x_offset[1]) + item.x_range[0];
            y_range_temp[0]=(areas[id].y+areas[id].height-item.y_offset[0])*(item.y_range[0]-
                    item.y_range[1])/(item.pixel[1]-item.y_offset[0]-item.y_offset[1])+item.y_range[1];
            y_range_temp[1]=(areas[id].y-item.y_offset[0])*(item.y_range[0]-item.y_range[1])
                    /(item.pixel[1]-item.y_offset[0]-item.y_offset[1])+item.y_range[1];
            item.x_range=x_range_temp;
            item.y_range=y_range_temp;
            url_temp ="/oceanview/post_img/"+active_item();
            try{
                $.ajax({
                    type : "POST",
                    url : url_temp,
                    data: JSON.stringify(item),
                    contentType: 'application/json;charset=UTF-8',
                    success: function(result) {
                        if (window.console) console.log("POST Success");
                    }
                });

            }
            catch(err){
            } 
            finally {
                    _active_item=active_item();
                    url_temp ="/oceanview/get_img/"+shot+"/"+new Date().getTime()+"/"+_active_item;
                    $("#img"+_active_item).attr("src",url_temp);
                    //$("#img"+active_item()).selectAreas('remove',id);
                    //$("#img"+_active_item).selectAreas('destroy');
                    $("div.select-areas-outline").remove();
                    $("#img"+_active_item).selectAreas('destroy');
                    $("#Reset").removeAttr("disabled");
                    $("#Reset_All").removeAttr("disabled");
            }
        };
    });



    function active_item(){
    return parseInt($("#viewCarousel  div.active").attr("value") );
    };

    function gakki_img(num_frames){
        for (var i=0;i<num_frames;i++){
            if(i==0){
                $("<li data-target=\"#viewCarousel\" data-slide-to=\""+i+"\" class=\"li_class  active\"></li>").appendTo("#carl_ind");
                $("<div class=\"item active\"  id=\"carl_item"+i+"\" value= "+i+"/>").appendTo("#carl_inner");
            }
            else{
                $("<li data-target=\"#viewCarousel\" data-slide-to=\""+i+"\" class=\"li_class\"></li>").appendTo("#carl_ind");

                    $("<div class=\"item\"  id=\"carl_item"+i+"\"value= "+i+"/>").appendTo("#carl_inner");
                }
        }
        for (var i=0;i<num_frames;i++){
                $("#carl_item"+i).prepend("<img id=\"img"+i+"\" />");
                url_temp ="/static/img_"+i+".jpg";
                $("#img"+i).attr("src",url_temp);
                $("#img"+i).attr("class",'img_in_slide');
                
        }
    };

    function update_img(num_frames){
        is_gakki =false
        $("div.item").remove();
        $("li.li_class").remove();
        $("#Loading").text("Loading the images");
        pixel=[parseInt($("#view_container").width()) , parseInt($("#view_container").width()*0.5625)]
        $("#carl_inner").css({
            position : "relative",
            top: 0,
            left: 0,
            width: pixel[0],
            height:pixel[1]
        });
        for (var i=0;i<num_frames;i++){
            $("<li data-target=\"#viewCarousel\" id=\"li-\" "+ i + " data-slide-to=\""+i+"\" class=\"li_class \"></li>").appendTo("#carl_ind");
            $("<div class=\"item\"  id=\"carl_item"+i+"\"value= "+i+"/>").appendTo("#carl_inner");

            /*
            if(i==0){
                $("<li data-target=\"#viewCarousel\" data-slide-to=\""+i+"\" class=\"li_class active\"></li>").appendTo("#carl_ind");
                $("<div class=\"item active\"  id=\"carl_item"+i+"\"value= "+i+"/>").appendTo("#carl_inner");
            }
            else{
                $("<li data-target=\"#viewCarousel\" data-slide-to=\""+i+"\" class=\"li_class \"></li>").appendTo("#carl_ind");
                $("<div class=\"item\"  id=\"carl_item"+i+"\"value= "+i+"/>").appendTo("#carl_inner");
                }
            */
        }

        if (window.console) console.log("div created");
        url_temp="/oceanview/get_img_list/"+shot;
        $.getJSON(url_temp, function(result){
            img_list = result["img_list"];
            //if (window.console) console.log(img_list);

            $.each(img_list,function(i,item){
                $("#carl_item"+i).prepend("<img id=\"img"+i+"\" />");
            });
            try{

                $.each(img_list,function(i,item){
                item.pixel = pixel
                url_temp ="/oceanview/post_img/"+i;
                $.ajax({
                    type : "POST",
                    url : url_temp,
                    data: JSON.stringify(item),
                    contentType: 'application/json;charset=UTF-8',
                    success: function(result) {
                        url_temp ="/oceanview/get_img/"+shot+"/"+ new Date().getTime()+"/"+i;
                        try{
                            $("#img"+i).attr("src",url_temp);
                            $("#img"+i).attr("class",'img_in_slide');

                        }
                        catch(err){
                            $("#img"+i).attr("src",url_temp);
                            $("#img"+i).attr("class",'img_in_slide');
                        }
                        finally{
                          /*   url_temp="/oceanview/get_list";
                             $.getJSON(url_temp, function(result){
                             img_list = result["img_list"];
                           });*/
                        }

                    }
            });


        });
            }
            finally{

            $("#carl_item0").attr("class","item active");
            $("#li-0").attr("class","li_class  active");
            $("#viewCarousel").carousel();

            }


        });
    };

    function flash_msg(msg){
        var url_temp ="/oceanview/flash_msg/";
        data={msg:msg}
        $.ajax({
            type : "POST",
            url : url_temp,
            data: JSON.stringify(data),
            contentType: 'application/json;charset=UTF-8',
            success: function(result) {
                }
            });

    };
});

