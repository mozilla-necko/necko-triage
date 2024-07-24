BugTable = function (id, config, triage) {
    this.id = id;
    this.title = config["title"];
    this.query = config["query"];
    this.extraColumns = config["extra_columns"]
    this.rowSort = config["default_sort"];
    this.isUser = config["is_user"];
    this.triage = triage;
};
BugTable.formatters = {
    "ni-date": GetNI,
    "alias": GetAlias,
    "owner": GetAssignee,
    "priority": GetPriority,
    "points": GetPoints,
    "rank": GetRank,
    "failure_count": GetFailureCount,
    "priority_queue_time": (rowData) => GetQueueTimeWithFlag(rowData, "necko-priority-queue"),
    "priority_next_queue_time": (rowData) => GetQueueTimeWithFlag(rowData, "necko-priority-next"),
    "priority_review_queue_time": (rowData) => GetQueueTimeWithFlag(rowData, "necko-priority-review"),
    "monitor_queue_time": (rowData) => GetQueueTimeWithFlag(rowData, "necko-monitor"),
};
BugTable.columnTitles = {
    "ni-date": "Last ni?",
    "alias": "Alias",
    "owner": "Owner",
    "priority": "Priority",
    "rank": "Rank",
    "points": "Points",
    "failure_count": "Failure Count",
    "priority_queue_time": "Priority Queue Time",
    "priority_next_queue_time": "Queue Time",
    "priority_review_queue_time": "Priority Review Queue Time",
    "monitor_queue_time": "Monitor Queue Time",
};
BugTable.sorters = {
    "ni-date": SortByNI,
    "severity": SortBySeverity,
    "id": SortByID,
    "failure_count": SortFailures,
    "priority": SortPriority,
    "points": SortPriority, // points are need to be sorted within the same priority
    "rank": SortPriority, // rank needs to be sorted within the same priority
    "priority_queue_time": (a, b) => SortByQueueTimeWithFlag(a, b, "necko-priority-queue"),
    "priority_next_queue_time": (a, b) => SortByQueueTimeWithFlag(a, b, "necko-priority-next"),
    "priority_review_queue_time": (a, b) => SortByQueueTimeWithFlag(a, b, "necko-priority-review"),
    "monitor_queue_time": (a, b) => SortByQueueTimeWithFlag(a, b, "necko-monitor"),
    "owner": SortAssignee,
};
BugTable.prototype.id = "";
BugTable.prototype.title = "";
BugTable.prototype.query = {};
BugTable.prototype.extraColumns = [];
BugTable.prototype.rowSort = null;
BugTable.prototype.rowSortDirection = null;
BugTable.prototype.triage = null;
BugTable.prototype.root = null;
BugTable.prototype.table = null;
BugTable.prototype.reloadSpan = null;
BugTable.prototype.data = null;
BugTable.prototype.invertSort = false;
BugTable.prototype.xhrError = function (xhr, status, errorThrown) {
    console.log("Error: " + errorThrown);
    console.log("Status: " + status);
    console.log(xhr);
    this.root.find(".error-message").text(errorThrown);
    this.root.find(".error-code").text(status);
    this.root.addClass("error");
};
BugTable.prototype.displayError = function (error, code) {
    console.log("Bugzilla Error: " + error);
    console.log("Bugzilla Error Code: " + code);
    this.root.find(".error-message").text(error);
    this.root.find(".error-code").text("" + code);
    this.root.addClass("error");
};
BugTable.prototype.display = function (data) {
    if (data.hasOwnProperty("error") && data["error"]) {
        this.displayError(data["message"], data["code"]);
        return;
    }
    this.root.removeClass("error");
    this.data = data;
    this.makeTable();
};
BugTable.prototype.sort = function (a, b) {
    let result = 0;
    if (this.rowSort && BugTable.sorters.hasOwnProperty(this.rowSort)) {
        result = BugTable.sorters[this.rowSort](a, b);
        if (this.invertSort && result != 0) {
            result = -result;
        }
    }

    return result;
};
BugTable.prototype.sortTable = function (columnID) {
    if (columnID != this.rowSort) {
        // Our sort has changed, so default to non-inverted
        this.invertSort = false;
        this.rowSort = columnID;
    } else {
        // Same sort re-clicked - invert the sort
        this.invertSort = !this.invertSort;
    }
    this.makeTable();
};
BugTable.prototype.makeTable = function () {
    let oldTable = this.table.children(".bug-table");
    if (oldTable) {
        oldTable.remove();
    }

    if (this.data["bugs"].length == 0) {
        this.root.addClass("zarro-boogs");
        let div = $("<div />", {id: this.id, text: "Zarro Boogs!", "class": "bug-table"});
        this.table.append(div);
        return;
    }

    this.root.removeClass("zarro-boogs");
    this.root.find("#bug-count-" + this.id).text("" + this.data["bugs"].length);

    let table = $("<table />", {id: this.id, "class": "bug-table"});
    let thead = $("<thead />", {id: "thead-" + this.id, "class": "bug-table-head"});
    let thr = $("<tr />", {id: "thead-tr-" + this.id, "class": "bug-table-row"});
    let idHead = $("<th />", {text: "Bug ID", id: "thead-id-" + this.id, "class": "bug-id sortable"});
    idHead.click($.proxy(this, "sortTable", "id"));
    thr.append(idHead);
    let sevHead = $("<th />", {text: "Severity", id: "thead-severity-" + this.id, "class": "bug-severity sortable"});
    sevHead.click($.proxy(this, "sortTable", "severity"));
    thr.append(sevHead);
    thr.append($("<th />", {text: "Summary", id: "thead-summary-" + this.id, "class": "bug-summary"}));
    let self = this;
    for (let columnID of this.extraColumns) {
        let columnTitle = BugTable.columnTitles[columnID];
        let columnHead = $("<th />", {text: columnTitle, id: "thead-" + columnID + "-" + this.id, "class": "bug-" + columnID});
        if (BugTable.sorters.hasOwnProperty(columnID)) {
            columnHead.click($.proxy(this, "sortTable", columnID));
            columnHead.addClass("sortable");
        }
        thr.append(columnHead);
    }
    thead.append(thr);
    table.append(thead);

    this.data["bugs"].sort($.proxy(this, "sort"));

    let tbody = $("<tbody />", {id: "tbody-" + this.id, "class": "bug-table-body"});
    $.each(this.data["bugs"], function (i, rowData) {
        let idPrefix = "tr-" + i + "-";
        let tr = $("<tr />", {id: idPrefix + self.id, "class": "bug-table-row"});

        let icon = "ui-icon-blank";
        for (let group of rowData["groups"]) {
            // NWGH - there may be other groups here that should be called out
            // but for now, these are the only ones I know about.
            if (group == "network-core-security" ||
                group == "core-security-release" ||
                group == "core-security") {
                icon = "ui-icon-locked";
            }
        }
        let idTd = $("<td />", {id: idPrefix + "id-" + self.id, "class": "bug-id"});
        let iconSpan = $("<span />", {"class": "ui-icon " + icon});
        idTd.append(iconSpan);
        let href = self.triage.settings.get("testing-only-bugzilla-origin") + "/show_bug.cgi?id=" + rowData["id"];
        let link = $("<a />", {href: href, text: "" + rowData["id"], id: idPrefix + "a-" + self.id, "class": "bug-link"});
        if (self.triage.settings.get("open-bugs-in-new-window")) {
            link.attr("target", "_blank");
        }
        if (self.triage.settings.get("modally-edit-bugs")) {
            link._BugView = new BugView(rowData["id"], self);
            link.click($.proxy(link._BugView, "view"));
        }
        idTd.append(link);
        tr.append(idTd);

        let severityTd = $("<td />", {text: rowData["severity"], id: idPrefix + "severity-" + self.id, "class": "bug-severity"});
        tr.append(severityTd);

        let summaryTd = $("<td />", {text: rowData["summary"], id: idPrefix + "summary-" + self.id, "class": "bug-summary"});
        tr.append(summaryTd);

        for (let columnID of self.extraColumns) {
            let td = $("<td />", {id: idPrefix + columnID + "-" + self.id, "class": "bug-" + columnID});
            if (BugTable.formatters.hasOwnProperty(columnID)) {
                let rowInfo = BugTable.formatters[columnID](rowData);
                if ($.type(rowInfo) == "object") {
                    // Selector returned a created element, put it in our td.
                    td.append(rowInfo);
                } else {
                    // Selector returned some plain text
                    td.text(rowInfo);
                }
            } else {
                td.text(rowData[k]);
            }

            tr.append(td);
        }

        tbody.append(tr);
    });

    table.append(tbody);

    this.table.append(table);
};
BugTable.prototype.enableFunctionality = function () {
    this.root.removeClass("loading");
    this.root.off("click");
};
BugTable.prototype.disableFunctionality = function () {
    this.root.click(function (e) {e.preventDefault();});
    this.root.addClass("loading");
};
BugTable.prototype.loadFailureCount = function (data) {
    let endDate = new Date().toISOString().slice(0,10).replace(/-/g,"-");
    let start = new Date();
    start.setDate(start.getDate() - 7);
    let startDate = start.toISOString().slice(0,10).replace(/-/g,"-");
    let total = data["bugs"].length;
    let count = 0;
    let callback = $.proxy(this, "display");
    $.each(data["bugs"], function (i, rowData) {
        let id = rowData["id"];
        let url = `https://treeherder.mozilla.org/api/failurecount/?bug=${id}&endday=${endDate}&format=json&startday=${startDate}&tree=all`;
        $.getJSON({url: url,
               type: "GET"})
             .done(function (result) {
                 count++;
                let testRuns = 0;
                let failureCount = 0;
                for (let i = 0; i < result.length; i++) {
                    testRuns += result[i]["test_runs"];
                    failureCount += result[i]["failure_count"];
                }
                rowData["test_runs"] = testRuns;
                rowData["failure_count"] = failureCount;
                if (testRuns > 0) {
                    rowData["failure_rate"] = (failureCount / testRuns).toFixed(3);
                } else {
                    rowData["failure_rate"] = 0.000;
                }
             })
             .fail(function() {
                 count++;
             })
             .always(function () {
                 // We've queried all failure count for all bugs.
                 if (count == total) {
                     callback(data);
                 }
             });
    });
}
BugTable.prototype.loadQueueTime = function (data, flag) {
    let bugzilla_origin = this.triage.settings.get("testing-only-bugzilla-origin");
    let apiKey = this.triage.settings.get("bz-apikey");
    let query = $.extend({}, this.query);
    if (apiKey) {
        $.extend(query, {"api_key": apiKey});
    }
    let total = data["bugs"].length;
    let count = 0;
    let callback = $.proxy(this, "display");
    $.each(data["bugs"], function (i, rowData) {
        let id = rowData["id"];
        let url = `${bugzilla_origin}/rest/bug/${id}/history`;
        $.getJSON({url: url,
                   type: "GET",
                   data: query,})
             .done(function (result) {
                count++;
                let history = result["bugs"][0]["history"];
                function findNeckoPriorityQueueAdditionTime(entries) {
                    for (let i = entries.length - 1; i >= 0; i--) {
                        const entry = entries[i];
                        for (const change of entry.changes) {
                            if (change.added.includes(flag) && change.field_name === "whiteboard") {
                                return entry.when;
                            }
                        }
                    }
                    return null; // Return null if not found
                }
                let timeAdded = findNeckoPriorityQueueAdditionTime(history);
                if (timeAdded) {
                    rowData[flag] = timeAdded;
                } else {
                    rowData[flag] = "unknown";
                }
             })
             .fail(function() {
                 count++;
             })
             .always(function () {
                 // We've queried all failure count for all bugs.
                 if (count == total) {
                     callback(data);
                 }
             });
    });
}
BugTable.prototype.load = function () {
    this.disableFunctionality();

    let apiKey = this.triage.settings.get("bz-apikey");
    let query = $.extend({}, this.query);
    if (apiKey) {
        $.extend(query, {"api_key": apiKey});
    }

    if (this.extraColumns.indexOf("failure_count") != -1) {
        $.getJSON({url: this.triage.settings.get("testing-only-bugzilla-origin") + "/rest/bug",
               data: query,
               type: "GET",
               traditional: true})
             .done($.proxy(this, "loadFailureCount"))
             .fail($.proxy(this, "xhrError"))
             .always($.proxy(this, "enableFunctionality"));
        return;
    }
    // Define a mapping from column names to flags
    const columnFlagMapping = {
        "priority_queue_time": "necko-priority-queue",
        "priority_next_queue_time": "necko-priority-next",
        "priority_review_queue_time": "necko-priority-review",
        "monitor_queue_time": "necko-monitor"
    };

    // Find the first matching column and get its corresponding flag
    let flag = null;
    for (const [column, columnFlag] of Object.entries(columnFlagMapping)) {
        if (this.extraColumns.indexOf(column) !== -1) {
            flag = columnFlag;
            break; // Exit the loop once a match is found
        }
    }

    if (flag !== null) {
        $.getJSON({
            url: this.triage.settings.get("testing-only-bugzilla-origin") + "/rest/bug",
            data: query,
            type: "GET",
            traditional: true
        })
        .done($.proxy(function(data) {
            this.loadQueueTime(data, flag); // Use the dynamically set flag
        }, this))
        .fail($.proxy(this, "xhrError"))
        .always($.proxy(this, "enableFunctionality"));
        return;
    }

    $.getJSON({url: this.triage.settings.get("testing-only-bugzilla-origin") + "/rest/bug",
               data: query,
               type: "GET",
               traditional: true})
             .done($.proxy(this, "display"))
             .fail($.proxy(this, "xhrError"))
             .always($.proxy(this, "enableFunctionality"));
};
BugTable.prototype.create = function () {
    // Build up our DOM objects, and stick them in the appropriate container
    this.root = $("<div />", {"id": "bug-container-" + this.id, "class": "bug-container"});
    if (this.isUser) {
        this.root.addClass("user-table");
    }

    let errorContainer = $("<div />", {"class": "bug-error"});
    errorContainer.text("Error loading from bugzilla. Data may be stale.");
    let bzDiv = $("<div />");
    bzDiv.html("<span class=\"error-message\"></span> (<span class=\"error-code\"></span>)");
    errorContainer.append(bzDiv);
    this.root.append(errorContainer);

    let titleWrapper = $("<div />");
    let title = $("<span />", {text: this.title, "class": "bug-table-title"});
    titleWrapper.append(title);

    let countPrefix = $("<span />", {text: " (", "class": "bug-count-prefix"});
    titleWrapper.append(countPrefix);
    let countWrapper = $("<span />", {"class": "bug-count"});
    let countHTML = "<span id=\"bug-count-" + this.id + "\"></span> bugs";
    countWrapper.html(countHTML);
    titleWrapper.append(countWrapper);
    let countPostfix = $("<span />", {text: ")", "class": "bug-count-postfix"});
    titleWrapper.append(countPostfix);

    this.reloadSpan = $("<span />", {"class": "reload-button ui-icon ui-icon-arrowrefresh-1-e", title: "Reload Table"});
    this.reloadSpan.click($.proxy(this, "load"));

    titleWrapper.append(this.reloadSpan);
    this.root.append(titleWrapper);

    this.table = $("<div />", {"id": this.id});
    this.root.append(this.table);

    this.triage.rootElement.append(this.root);

    let tab = $("<li />", {id: "bug-tab-" + this.id, "class": "bug-tab"});
    if (this.isUser) {
        tab.addClass("user-table-tab");
    }
    let a = $("<a />", {href: "#bug-container-" + this.id, text: this.title});
    tab.append(a);
    $("#necko-triage-tabs").append(tab);

    this.load();
};
