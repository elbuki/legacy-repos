angular.module('remindr', ['ionic', 'ionicCalendarDisplay',
							'ion-datetime-picker', 'remindr-constants'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {

      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
	  .state('tab', {
	    url: '',
	    abstract: true,
	    templateUrl: 'app/tabs.html'
	  })

	  .state('tab.events', {
	    url: '/events',
	    views: {
	      'tab-events': {
	        templateUrl: 'app/events/event-list.html',
	        controller: 'EventController',
	        controllerAs: 'vm'
	      }
	    }
	  })

	  .state('tab.classes', {
	      url: '/classes',
	      views: {
	        'tab-classes': {
	          templateUrl: 'app/classes/classes-list.html',
	          controller: 'ClassesListContoller',
			  controllerAs: 'vm'
	        }
	      }
	    })
	    // .state('tab.chat-detail', {
	    //   url: '/chats/:chatId',
	    //   views: {
	    //     'tab-chats': {
	    //       templateUrl: 'templates/chat-detail.html',
	    //       controller: 'ChatDetailCtrl'
	    //     }
	    //   }
	    // })

	  .state('tab.account', {
	    url: '/account',
	    views: {
	      'tab-account': {
	        templateUrl: 'app/user/user-settings.html',
	        controller: 'UserSettingController',
			controllerAs: 'vm'
	      }
	    }
	  })

	  .state('login', {
	      url: '/login',
	      controller: 'LoginController',
	      controllerAs: 'vm',
	      templateUrl: 'app/login/login.html'
	  });

  $urlRouterProvider.otherwise('/events');
})

.config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom');
}])

.run(function($ionicPickerI18n) {

	$ionicPickerI18n.weekdays = ['D', 'L', 'K', 'M', 'J', 'V', 'S'];
	$ionicPickerI18n.months = 	['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
								'Junio', 'Julio', 'Agosto', 'Septiembre',
								'Octubre', 'Noviembre', 'Diciembre'];
	$ionicPickerI18n.ok = 'Aceptar';
	$ionicPickerI18n.cancel = 'Cancelar';
	$ionicPickerI18n.okClass = 'button-positive';
    $ionicPickerI18n.cancelClass = 'button-stable';
});
