(function() {
    angular
        .module("pp")
        .controller("registerController", registerController);

    function registerController($location, authService, sharedService) {
        var vm = this;

        vm.registerUser = registerUser;

        (function init() {
            _fetchTemplates();
            _initHeaderFooter();
        })();

        function registerUser(user) {
            authService
                .createUser(user || {})
                .then(function(res){
                    if (res.msg) {
                        vm.errorMsg = res.msg;
                    } else {
                        $location.url(profile);
                    }
            });
        }

        function _fetchTemplates() {
            vm.templates = sharedService.getTemplates();
        }

        function _initHeaderFooter() {
            vm.navHeader = {
                leftLink: {href: "#!", iconClass: "glyphicon-home", name: "Home"},
                name: "Register",
                rightLink: {href: "#!/login", iconClass: "glyphicon-log-in", name: "Login"}
            };
        }
    }
})();