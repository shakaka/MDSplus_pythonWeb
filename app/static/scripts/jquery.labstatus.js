$(document).ready(function($){
    var wireless_ad_bv = {'bt1': 0.0, 'bt2': 0.0, 'bo11': 0.0, 'bo12': 0.0, 'bo21': 0.0, 'bo22': 0.0, 'bv1': 0.0, 'bv2': 0.0}
    var wireless_ad_v = {'bt1': 0.0, 'bt2': 0.0, 'bo11': 0.0, 'bo12': 0.0, 'bo21': 0.0, 'bo22': 0.0, 'bv1': 0.0, 'bv2': 0.0}
    var socket = io.connect('http://192.168.1.39');
    var bv_up_time =$.now();
    var v_up_time  =$.now();

    $.getJSON('/labstatus/get_ad_bv/', function(result){
        wireless_ad_bv =result['wireless_ad_bv'];
        update_ad_bv(wireless_ad_bv);
    });
    $.getJSON('/labstatus/get_ad_v/', function(result){
        wireless_ad_v =result['wireless_ad_v'];
        update_ad_v(wireless_ad_v);
    });

    socket.on('ad_voltage', function(msg) {
        wireless_ad_v = msg;
        v_up_time = $.now();
        update_ad_v(wireless_ad_v);

    });
  function update_ad_v(wireless_ad_v){
            $.each(wireless_ad_v,function(i,item){
            if(item == null){
                $('#tr_'+i+' td').eq(1).text('---------')
            }
            else{
                $('#tr_'+i+' td').eq(1).text(item.toFixed(3))
            }
        });

  }
    socket.on('ad_b_voltage', function(msg) {
        wireless_ad_bv = msg;
        if (window.console) console.log(msg);
        bv_up_time = $.now();
        update_ad_bv(wireless_ad_bv);
    });

    function update_ad_bv(wireless_ad_bv){
            $.each(wireless_ad_bv,function(i,item){
            if(item == null){
                $('#tr_'+i+' td').eq(2).text('disconnected')
                $('#tr_'+i+' td').eq(2).css('color', 'red');
            }
            else{
                var text= item.toFixed(3);
                if(item<3.8){
                    text+=' (low power)'
                    $('#tr_'+i+' td').eq(2).css('color', 'red');
                }
                else{$.now()
                    $('#tr_'+i+' td').eq(2).css('color', '#333');
                }
            $('#tr_'+i+' td').eq(2).text(text)
            }
        });

    }


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



});

