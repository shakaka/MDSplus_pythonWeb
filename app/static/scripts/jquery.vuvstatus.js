$(document).ready(function($){

    $("#temp_set_btn").hide();

    var cool_sys = {'flow1': 0.0, 'flow2': 0.0, 'temp1': 0.0, 'temp2': 0.0, 'fan10': 0.0, 'fan11': 0.0, 'fan20': 0.0, 'fan21': 0.0,
          'pump1': 0.0, 'pump2': 0.0, 'peltier1': false, 'peltier2': false}

    var temp_sets={'temp1': 20.0, 'temp2': 20.0}
    var table_dict = {'flow1':'flow', 'flow2':'flow','temp1':'temp_get',
            'temp2':'temp_get','fan10': 'fan0', 'fan11': 'fan1', 'fan20': 'fan0', 'fan21': 'fan1',
          'pump1': 'pump', 'pump2': 'pump', 'peltier1': 'peltier1_btn', 'peltier2': 'peltier2_btn'}
    var table_dict_index = {'flow1':1, 'flow2':2,'temp1':1,
            'temp2':2,'fan10': 1, 'fan11': 1, 'fan20': 2, 'fan21': 2,
          'pump1': 1, 'pump2': 2}
    var table_dict_get = {'temp1':'temp_set','temp2':'temp_set'}
    var socket = io.connect('http://192.168.1.39');
    var item_last = {'flow1':0.0, 'flow2':0.0,'temp1':0.0,
            'temp2':0.0,'fan10': 0.0, 'fan11': 0.0, 'fan20': 0.0, 'fan21': 0.0,
          'pump1': 0.0, 'pump2': 0.0, 'peltier1': 0.0, 'peltier2': 'peltier2_btn'}

    $.getJSON('/vuvstatus/get_vuvstatus/', function(result){
        cool_sys =result['vuvstatus'];
        update_vuvstatus(cool_sys);
    });

    $.getJSON('/vuvstatus/get_temp_set/', function(result){
        temp_sets =result['temp_set'];
        update_temp_set(temp_sets);
    });


    $("#temp_edit_btn").click(function(){
              if($("#temp_edit_btn").text() ==='Edit'){
                  $("#temp_set_btn").show();
                  $('#temp_set td').eq(1).attr('contenteditable','true');
                  $('#temp_set td').eq(2).attr('contenteditable','true');
                  $("#temp_edit_btn").addClass('btn-danger');
                  $("#temp_edit_btn").text('Quit');
             }
              else{
                  $("#temp_set_btn").hide();
                  $('#temp_set td').eq(1).attr('contenteditable','false');
                  $('#temp_set td').eq(2).attr('contenteditable','false');
                  $("#temp_edit_btn").removeClass('btn-danger');
                  $("#temp_edit_btn").text('Edit');
              }

          });


  $("#temp_set_btn").click(function(){
                var temp1_set = parseFloat($('#temp_set td').eq(1).text());
                var temp2_set = parseFloat($('#temp_set td').eq(2).text());

                if(!temp1_set || !temp2_set){
                alert('Please input right numbers!')
                return;
                }
                if(temp1_set<-10.0 || temp1_set>30.0 || temp2_set< -10.0 ||temp2_set>30.0){
                alert('Please input the temperature between -10.0 to 30.0!')
                return;
                }
                $("#temp_set_btn").hide();
                $('#temp_set td').eq(1).attr('contenteditable','false');
                $('#temp_set td').eq(2).attr('contenteditable','false');
                $("#temp_edit_btn").removeClass('btn-danger');
                $("#temp_edit_btn").text('Edit');

                var data={"temp1":temp1_set, "temp2":temp2_set};

                //if (window.console) console.log(typeof(value));
                $.ajax({
                      type: 'POST',
                      url: '/vuvstatus/post_temp_set/',
                      data: JSON.stringify(data),
                      contentType: 'application/json;charset=UTF-8',
                      success: function(response){}
                });
          });



    socket.on('vuv_temp_set', function(msg) {
        $.each(msg,function(key,value){
            temp_set[key]=value;
        });
        if (window.console) console.log(msg);
        update_temp_set(msg);
    });


    function update_temp_set(msg){
       $.each(msg,function(key,value){

       var text=value.toFixed(1)
       if (window.console) console.log('table_dict[key]:'+table_dict[key]);
       if (window.console) console.log('table_dict_index[key]:'+table_dict_index[key]);
       $('#'+table_dict_get [key]+' td').eq(table_dict_index[key]).text(text);
     });

    }

    socket.on('vuvstatus', function(msg) {
        $.each(msg,function(key,value){
            cool_sys[key]=value;
        });
        update_vuvstatus(msg);
    });


    function update_vuvstatus(msg){
       $.each(msg,function(key,value){
             $.each(msg,function(key,value){
             //if (window.console) console.log(key);
            if(key =='peltier1' || key =='peltier2'){
                if (window.console) console.log('equal');
                if(value){
                    $('#'+table_dict[key]).addClass('btn-success');
                }
                else{
                    $('#'+table_dict[key]).removeClass('btn-success');
                }

            }
            else{
                //if (window.console) console.log(typeof(value));
                var text = value.toFixed(2);
                $('#'+table_dict[key]+' td').eq(table_dict_index[key]).text(text);

            }
        });

     });
     }
/*
    setInterval(function(){
        if($.now() - bv_up_time > 5*1000){
            $.each(wireless_ad_bv,function(i,item){
                $('#tr_'+i+' td').eq(2).text('disconnected');
                $('#tr_'+i+' td').eq(2).css('color', 'red');
            });
        }

        if($.now() - v_up_time > 5*1000){
            $.each(wireless_ad_bv,function(i,item){
                $('#tr_'+i+' td').eq(1).text('---------')
            });
        }
    }, 2000);

*/

});

