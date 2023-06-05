$(document).ready(function(){
 

$.getJSON("/flight/fetchallstates",function(data){
   
    html= "";
            data.map((item)=>{

             $('#sourcestate').append($('<option>').text(item.statename).val(item.stateid)
             
             );


            });    
            $('#sourcestate').formSelect();
});

$('#sourcestate').change(function(){

    $('#sourcecity').empty();
    
    $('#sourcecity').append($('<option disabled selected>').text('-Cities-'));

    $.getJSON("/flight/fetchallcity",{stateid:$('#sourcestate').val()},function(data){
   
        html= "";
                data.map((item)=>{
                 $('#sourcecity').append($('<option>').text(item.cityname).val(item.cityid)
                 );
                });    
                $('#sourcecity').formSelect();
    });

});

$.getJSON("/flight/fetchallstates",function(data){
   
    html= "";
            data.map((item)=>{
             $('#destinationstate').append($('<option>').text(item.statename).val(item.stateid)
             );
            });    
            $('#destinationstate').formSelect();
});

$('#destinationstate').change(function(){

    $('#destinationcity').empty();
    
    $('#destinationcity').append($('<option disabled selected>').text('-Cities-'));

    $.getJSON("/flight/fetchallcity",{stateid:$('#destinationstate').val()},function(data){
   
        html= "";
                data.map((item)=>{
                 $('#destinationcity').append($('<option>').text(item.cityname).val(item.cityid)
                 );
                });    
                $('#destinationcity').formSelect();
    });
});

$('#btn').click(function(){

    $.getJSON('/flight/searchflight',{sourcecity:$('#sourcecity').val(),destinationcity:$('#destinationcity').val()},function(data){
        
        if(data.length==0)
{
    $('#result').html("<h1>Flight does not Exist..</h1>")
} 

else{
    var htm=''
  htm="  <table class='striped'><thead><tr><th>Flight Id</th><th>Company Name</th><th>Source</th><th>Destination</th><th>Type</th><th>Class</th><th>Days</th></tr></thead><tbody>"
     
 data.map((item)=>{ 

htm+="<tr><td>"+item.flightid+"</td><th><img src='/images/"+item.logo+"' width='40'>"+item.companyname+"</th><td>"+item.sc+"<br>"+item.sourcetiming+"</td><td>"+item.dc+"<br>"+item.destinationtiming+"</td><td>"+item.status+"</td><td>"+item.flightclass+"</td><td>"+item.days+"</td></tr>"

 })

  htm+="</tbody></table>"
}

    $('#result').html(htm)

})
})
});

