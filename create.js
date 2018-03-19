/*jslint
    es6, node, this
*/
(function () {
    "use strict";

    const stampit = require("@stamp/it");
    const configure = require("./configure");
    const operation = require("./operation");

    module.exports = stampit(configure, operation, {
        statics: {
            // See https://dev.targetprocess.com/docs/operations
            resources: [
                // "Assignables",
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
                // "Generals",
                "GeneralFollowers",
                // "GeneralUsers",
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
                // "ProjectAllocations",
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
            ]
        },
        deepProps: {
            options: {
                method: "POST"
            }
        },
        methods: {
            create(obj) {
                this.options.body = obj;
                return this.request(this.options);
            }
        }
    });
}());
