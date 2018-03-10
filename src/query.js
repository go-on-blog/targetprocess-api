/*jslint
    es6, node, this
*/
(function () {
    "use strict";

    // See https://md5.tpondemand.com/api/v1/index/meta
    const resources = [
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
    ];

    function factory(uri, token, resource) {
        if (!resources.includes(resource)) {
            throw new Error(`"${resource}" is not a valid Targetprocess resource.`);
        }

        const options = {
            uri: `${uri}/${resource}/`,
            qs: {token},
            json: true,
            headers: {Authorization: `Basic ${token}`}
        };

        function normalize(response) {
            return response.Items;
        }

        function get() {
            const request = require("request-promise-native");
            return request(options).then(normalize);
        }

        function take(count) {
            options.qs.take = count;
            return this;
        }

        function skip(count) {
            options.qs.skip = count;
            return this;
        }

        function where(condition) {
            options.qs.where = condition;
            return this;
        }

        function orderby(attribute) {
            options.qs.orderby = attribute;
            return this;
        }

        function orderbydesc(attribute) {
            options.qs.orderbydesc = attribute;
            return this;
        }

        function pick(keys) {
            if (options.qs.exclude) {
                options.qs.exclude = null;
            }

            // Nested attributes are not supported yet
            options.qs.include = `[${keys.join(",")}]`;
            return this;
        }

        function omit(keys) {
            if (options.qs.include) {
                options.qs.include = null;
            }

            // Nested attributes are not supported yet
            options.qs.exclude = `[${keys.join(",")}]`;
            return this;
        }

        function append(keys) {
            options.qs.append = `[${keys.join(",")}]`;
            return this;
        }

        return {
            get,
            take,
            skip,
            where,
            orderby,
            orderbydesc,
            pick,
            omit,
            append
        };
    }

    module.exports = factory;
    module.exports.resources = resources;
}());
