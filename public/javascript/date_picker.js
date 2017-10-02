$("#date").datepicker({
  dateFormat: "mm/yy",
  changeMonth: true,
  changeYear: true,
  minDate: new Date(2016, 5, 1),
  maxDate: new Date(2017, 7, 1),
  showButtonPanel: true,
  onClose : function(dateText, inst){
    function isDonePressed(){
      return ($('#ui-datepicker-div').html().indexOf('ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all ui-state-hover') > -1);
    }

    if (isDonePressed()){
        var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
        var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
        $(this).datepicker('setDate', new Date(year, month, 10)).trigger('change'); 
    }
  }
});