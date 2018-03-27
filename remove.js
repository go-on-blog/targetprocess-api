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
            ]
        },
        deepProps: {
            options: {
                method: "DELETE"
            }
        },
        methods: {
            remove(id) {
                if (!id) {
                    return Promise.reject(new Error("The id must be provided in order to perform this removal"));
                }

                this.options.uri = this.options.uri.concat(id);
                return this.request(this.options);
            },

            batchRemove(batch) {
                if (!Array.isArray(batch)) {
                    return Promise.reject(new Error("The argument must be an array to perform a batch removal"));
                }

                if (batch.length === 1) {
                    return this.remove(batch[0]);
                }

                this.options.body = batch.map((id) => ({Id: id}));
                this.options.uri = this.options.uri.concat("bulk");
                return this.request(this.options);
            }
        }
    });
}());
