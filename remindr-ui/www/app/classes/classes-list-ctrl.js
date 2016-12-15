angular
    .module('remindr')
    .controller('ClassesListContoller', function() {

        var vm = this;

        vm.items = ['Gestión ambiental', 'Filosofía',
                    'Sistemas operativos de red', 'Diseño web',
                    'Matemática general', 'Programación III',
                    'Circuitos electrónicos', 'Contabilidad',
                    'Fundamentos de las bases de datos',
                    'Ingeniería del software', 'Fundamentos de programación',
                    'Estadística descriptiva', 'Minería de datos',
                    'Trabajo comunal universitario', 'Programación I'];
    });
