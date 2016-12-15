'use strict';

/**
 * @ngdoc function
 * @name intercambealoApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the intercambealoApp
 */
angular.module('fictionalApp')
  .controller('DashboardCtrl', function($scope, $http, Question, $q) {

    $scope.colors = ['rgba(151,187,205,1)', 'rgba(220,220,220,1)',
                     'rgba(247,70,74,1)', 'rgba(70,191,189,1)',
                     'rgba(253,180,92,1)', 'rgba(148,159,177,1)',
                     'rgba(77,83,96,1)'];

    $scope.editMode = false;

    var beforeSave = [];
    var surveyId = '';

    Question.get(function(response) {

        if(response[0]) {

            response = response[0];
            if(response._id) {
                surveyId = response._id;
            }
        }
        $scope.questions = beforeSave = response.questions || [];
        $scope.chartData = getChartData(response.questions || []);
    }, function(error) {

        $('.alert-danger span').html(error.data.message).parent().slideDown();

        setTimeout(function() {
          $('.alert-danger').slideUp();
        }, 5000);
    });

    function getChartData(questions) {

        var data = [];

        questions.map(function(question) {

            var questionData = {
                answers: [],
                pickedCounts: [],
            };

            question.answers.map(function(answer) {

                if((answer.answer && answer.pickedCount) && !isNaN(answer.pickedCount)) {
                    questionData.answers.push(answer.answer);
                    questionData.pickedCounts.push(answer.pickedCount);
                }

            });

            data.push(questionData);
        });

        return data;
    };

    $scope.calculatePercentage = function(values, count) {

        var total = 0;
        var result = 0;

        values.map(function(value) {

            total += +value;
        });

        result = ((count / total) * 100).toFixed(1);

        return !isNaN(result) ? result + '%' : '';
    };

    $scope.addQuestion = function() {

        var newQuestion = {
            question: 'Enter your question here!',
            answers: []
        };

        $scope.questions.push(newQuestion);
        angular.element('html, body').animate({
            scrollTop: angular.element(document).height()
        }, 500);
    };

    $scope.removeQuestion = function(index) {

        $scope.questions.splice(index, 1);
    };

    $scope.addAnswer = function(index) {

        $scope.questions[index].answers.push({});
        $scope.updateCharts();
    };

    $scope.removeAnswer = function(answerIndex, questionIndex) {

        $scope.questions[questionIndex].answers.splice(answerIndex, 1);
        $scope.updateCharts();
    };

    $scope.updateCharts = function() {

        $scope.chartData = getChartData($scope.questions);
    };

    $scope.$on('edit-mode', function(event, args) {

        $scope.editMode = !$scope.editMode;
    });

    $scope.$on('add-question', function(event, args) {

        $scope.addQuestion();
    });

    $scope.$on('refresh', function(event, args) {

        $scope.updateCharts();
    });

    $scope.$on('save-changes', function(event, args) {

        $scope.questions.map(function(question) {

            question.answers = question.answers.filter(function(answer) {

                return answer.answer;
            });
        });

        var config = {
            method: 'PUT',
            url: 'http://localhost:3000/questions/',
            data: {
                _id: surveyId || '578bdb5c19ee7c0844fd76c4',
                questions: $scope.questions
            }
        };

        $http(config)
            .then(function(response) {

                $scope.updateCharts();

                $('.alert-success span').html('Changes successfully saved!').parent().slideDown();

                setTimeout(function() {
                  $('.alert-success').slideUp();
                }, 2500);
            }, function(error) {
                console.log(error);
            });
    });

  });
