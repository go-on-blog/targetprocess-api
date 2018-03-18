/*jslint
    es6, node, this
*/
(function () {
    "use strict";

    // See https://dev.targetprocess.com/docs/operations
    const resources = [
        "Assignables",
        // "AssignedEfforts",
        "Assignments",
        "Attachments",
        "Bugs",
        "Builds",
        "Comments",
        "Companies",
        "CustomActivities",
        "CustomFields",
        // "CustomRules",
        "EntityStates",
        // "EntityTypes",
        "Epics",
        "Features",
        "Generals",
        "GeneralFollowers",
        "GeneralUsers",
        // "GlobalSettings",
        "Impediments",
        "InboundAssignables",
        "Iterations",
        "Messages",
        "MessageUids",
        "Milestones",
        "OutboundAssignables",
        "Priorities",
        "Processes",
        "Programs",
        "Projects",
        "ProjectAllocations",
        "ProjectMembers",
        "Relations",
        // "RelationTypes",
        "Releases",
        "ReleaseProjects",
        "Requests",
        "Requesters",
        "RequestTypes",
        "Revisions",
        "RevisionFiles",
        "Roles",
        "RoleEfforts",
        "RoleEntityTypes",
        "Severities",
        "Tags",
        "Tasks",
        "Teams",
        "TeamAssignments",
        "TeamIterations",
        "TeamMembers",
        "TeamProjects",
        "TeamProjectAllocations",
        // "Terms",
        "TestCases",
        "TestCaseRuns",
        "TestPlans",
        "TestPlanRuns",
        // "TestRunItemHierarchyLinks",
        "TestSteps",
        "TestStepRuns",
        "Times",
        "Users",
        "UserProjectAllocations",
        "UserStories",
        "Workflows"
    ];

    function factory(uri, token, resource) {
        if (!resources.includes(resource)) {
            throw new Error(`"${resource}" is not available for deletion.`);
        }

        const options = {
            method: "DELETE",
            uri: `${uri}/${resource}/`,
            qs: {token},
            json: true
        };

        function remove(id) {
            const request = require("request-promise-native");

            if (!id) {
                const when = require("when");
                return when.reject(new Error("The id must be provided in order to perform this deletion"));
            }

            options.uri = options.uri.concat(id);
            return request(options);
        }

        return {
            remove
        };
    }

    module.exports = factory;
    module.exports.resources = resources;
}());
