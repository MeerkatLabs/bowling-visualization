/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Service that will find the team object.
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.factory('TeamFindService', ['$q', 'dataService', function($q, dataService) {

    var findTeam = function(teamId) {

        var deferred = $q.defer();

        dataService.getData().then(function (league) {
            var foundTeam = bowling.utils.findInArray(league.teams, function (element) {
                return teamId == element.id;
            });

            if (foundTeam === null) {
                console.error("Couldn't find team: " + teamId);
                return;
            }

            deferred.resolve({
                league: league,
                team: foundTeam
            });
        });

        return deferred.promise;
    };

    return {
        findTeam: findTeam
    };

}]);
