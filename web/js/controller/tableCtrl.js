/**
 * Created by lingyin on 15/5/18.
 */
IndonesiaApp

.controller('tableCtrl',function($scope){
$scope.exportData = function () {
    var blob = new Blob([document.getElementById('exportable').innerHTML], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
    });
    saveAs(blob, "Report.");
};

$scope.items = [{
    name: "John Smith",
    email: "j.smith@example.com",
    dob: "1985-10-10"
}, {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    dob: "1988-12-22"
}, {
    name: "Jan Smith",
    email: "jan.smith@example.com",
    dob: "2010-01-02"
}, {
    name: "Jake Smith",
    email: "jake.smith@exmaple.com",
    dob: "2009-03-21"
}, {
    name: "Josh Smith",
    email: "josh@example.com",
    dob: "2011-12-12"
}, {
    name: "Jessie Smith",
    email: "jess@example.com",
    dob: "2004-10-12"
}]
    }
)