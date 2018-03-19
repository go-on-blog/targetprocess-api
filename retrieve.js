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
            // See https://md5.tpondemand.com/api/v1/index/meta
            resources: [
                "Assignables",
                "AssignedEfforts",
                "Assignments",
                "Attachments",
                "Bugs",
                "Builds",
                "Comments",
                "Companies",
                "CustomActivities",
                "CustomFields",
                "CustomRules",
                "EntityStates",
                "EntityTypes",
                "Epics",
                "Features",
                "Generals",
                "GeneralFollowers",
                "GeneralUsers",
                "GlobalSettings",
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
                "RelationTypes",
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
                "Terms",
                "TestCases",
                "TestCaseRuns",
                "TestPlans",
                "TestPlanRuns",
                "TestRunItemHierarchyLinks",
                "TestSteps",
                "TestStepRuns",
                "Times",
                "Users",
                "UserProjectAllocations",
                "UserStories",
                "Workflows"
            ]
        },
        methods: {
            get() {
                function normalize(response) {
                    return response.Items;
                }

                return this.request(this.options).then(normalize);
            },

            take(count) {
                this.options.qs.take = count;
                return this;
            },

            skip(count) {
                this.options.qs.skip = count;
                return this;
            },

            where(condition) {
                this.options.qs.where = condition;
                return this;
            },

            orderby(attribute) {
                this.options.qs.orderby = attribute;
                return this;
            },

            orderbydesc(attribute) {
                this.options.qs.orderbydesc = attribute;
                return this;
            },

            pick(keys) {
                if (this.options.qs.exclude) {
                    this.options.qs.exclude = null;
                }

                // Nested attributes are not supported yet
                this.options.qs.include = `[${keys.join(",")}]`;
                return this;
            },

            omit(keys) {
                if (this.options.qs.include) {
                    this.options.qs.include = null;
                }

                // Nested attributes are not supported yet
                this.options.qs.exclude = `[${keys.join(",")}]`;
                return this;
            },

            append(keys) {
                this.options.qs.append = `[${keys.join(",")}]`;
                return this;
            }
        }
    });
}());
