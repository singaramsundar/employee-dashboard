angular.module('app', ['datatables', 'datatables.bootstrap', 'chart.js'])
    .controller('main', function($scope, DTOptionsBuilder, DTColumnBuilder, $http) {

        // define datatable options
        $scope.dtOptions = DTOptionsBuilder
            .fromSource('new_hire.json')
            .withBootstrap();
        // construct data table columns based on fields in the JSON file
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('name').withTitle('Name'),
            DTColumnBuilder.newColumn('jobTitle').withTitle('Title'),
            DTColumnBuilder.newColumn('tenure').withTitle('Tenure'),
            DTColumnBuilder.newColumn('gender').withTitle('Gender')
        ];

        // fetch JSON document using http
        $http.get('new_hire.json').then(function(success) {
            var data = success.data;
            var jobTitle = {}, male = 0, female = 0;
            $scope.label = [];
            $scope.data = [];
            $scope.genderData = [];
            $scope.genderLabel = ['Male', 'Female'];

            // iterate through the document and build a map with list of all job titles and its count
            for(var i=0; i<data.length; i++) {
                if (jobTitle.hasOwnProperty(data[i].jobTitle)) {
                    jobTitle[data[i].jobTitle] += 1;
                } else {
                    jobTitle[data[i].jobTitle] = 1;
                }

                // check gender and increment gender count
                if(data[i].gender === 'Male') {
                    male++;
                } else {
                    female++;
                }
            }

            // convert job title and its count map to label and data array for building pie chart
            for(var key in jobTitle) {
                $scope.label.push(key);
                $scope.data.push(jobTitle[key]);
            }

            // set pie chart options
            $scope.options = {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true
                }
            };

            // define data, label and options for gender bar chart
            $scope.genderData = [male, female];
            $scope.genderLabel = ['Male', 'Female'];

            $scope.genderOptions = {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true,
                            stepSize:1
                        }
                    }]
                }
            }
        });
    });