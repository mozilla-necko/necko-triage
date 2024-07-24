function SortByID(a, b) {
    return a["id"] - b["id"];
}

function SortBySeverity(a, b) {
    const SeverityMap = [
        "blocker",
        "critical",
        "major",
        "normal",
        "minor",
        "trivial",
        "enhancement"
    ];
    const NewSeverityMap = [
        "S1",
        "S2",
        "S3",
        "S4",
        "S5",
        "--",
        "N/A",
    ];
    let aSev = SeverityMap.indexOf(a["severity"]);
    if (aSev == -1) {
        aSev = NewSeverityMap.indexOf(a["severity"]);
    }
    let bSev = SeverityMap.indexOf(b["severity"]);
    if (bSev == -1) {
        bSev = NewSeverityMap.indexOf(b["severity"]);
    }

    return aSev - bSev;
}

function GetNIHelper(dataRow) {
    let lastNI = undefined;
    for (let flag of dataRow["flags"]) {
        if (flag["name"] == "needinfo") {
            lastNI = flag["modification_date"];
        }
    }

    return lastNI;
}

function SortByNI(a, b) {
    let aNI = GetNIHelper(a);
    let bNI = GetNIHelper(b);

    if (a === undefined || b === undefined) {
        // Use our default sort instead
        return SortBySeverity(a, b);
    }

    let aDate = new Date(aNI);
    let bDate = new Date(bNI);

    // We want the oldest ones first
    if (aDate < bDate) {
        return -1;
    }

    if (bDate < aDate) {
        return 1;
    }

    // Fall back to the default sort
    return SortBySeverity(a, b);
}

function ToRelativeDate(time) {
    if ($.type(time) == "string") {
        let relativeTime = moment(time).fromNow();
        let span = $("<span />", {title: time, text: relativeTime});
        span.tooltip();
        time = span;
    } else {
        time = "unknown";
    }

    return time;
}

function GetNI(dataRow) {
    let lastNI = GetNIHelper(dataRow);

    return ToRelativeDate(lastNI);
}

function MakeSelect(name, options, selected, valueGetter) {
    let select = $("<select />", {name: name});

    for (let i = 0; i < options.length; i++) {
        let option;
        if (valueGetter !== undefined) {
            option = valueGetter(options[i]);
        } else {
            option = options[i];
        }

        let item;
        if (option == selected) {
            item = $("<option />", {"value": option, "text": option, "selected": true});
        } else {
            item = $("<option />", {"value": option, "text": option});
        }

        select.append(item);
    }

    return select;
}

function MakeLabel(node, label) {
    let nodeName;
    if (typeof node == "string") {
        nodeName = node;
    } else {
        nodeName = node.attr("name");
    }
    return $("<label />", {"for": nodeName, "text": label});
}

function MakeCheckbox(name, label) {
    let w = $("<span />", {"class": "checkbox-wrapper"});
    w.append($("<input />", {"type": "checkbox", "name": name}));
    w.append($("<label />", {"for": name, "text": label}));
    return w;
}

function MakeTextbox(name, label, value) {
    let w = $("<span />", {"class": "textbox-wrapper"});
    w.append($("<label />", {"for": name, "text": label}));
    let t = $("<input />", {"type": "text", "name": name});
    if (value !== undefined) {
        t.attr("value", value);
    }
    w.append(t);
    return w;
}

function FormatDate(dateString) {
    let d = new Date(dateString);
    return d.toLocaleString();
}

function GetAlias(datarow) {
    return datarow["alias"] || "";
}

function GetAssignee(datarow) {
    let assignee = datarow["assigned_to"] || "";
    if (assignee === "nobody@mozilla.org" || assignee === "general@network.bugs") {
        assignee = "";
    }
    return assignee.split('@')[0];
}

function SortAssignee(a, b) {
    console.log(a);
    console.log(GetAssignee(a).localeCompare(GetAssignee(b)));
    return GetAssignee(a).localeCompare(GetAssignee(b));
}

function GetPriority(datarow) {
    return datarow["priority"] || "";
}

function GetPoints(datarow) {
    return datarow["cf_fx_points"] || "";
}

function GetRank(datarow) {
    return datarow["cf_rank"] || "--";
}

function GetFailureCount(datarow) {
    return datarow["failure_count"] || 0;
}

function SortFailures(a, b) {
    return b["failure_count"] - a["failure_count"];
}

function SortByPoints(a, b) {
    let pointA = a["cf_fx_points"] === "--" ? 1 : parseInt(a["cf_fx_points"]);
    let pointB = b["cf_fx_points"] === "--" ? 1 : parseInt(b["cf_fx_points"]);
    return pointA > pointB;
}

function SortByRank(a, b) {
    let rankA = a["cf_rank"] === "--" || a["cf_rank"] === null ? 10 : parseInt(a["cf_rank"]);
    let rankB = b["cf_rank"] === "--" || b["cf_rank"] === null ? 10 : parseInt(b["cf_rank"]);
    if (rankA === rankB) {
        return SortByPoints(a, b);
    }
    return rankA > rankB;
}

function SortPriority(a, b) {
    let priorityA = a["priority"] === "--" ? 1 : parseInt(a["priority"].slice(1));
    let priorityB = b["priority"] === "--" ? 1 : parseInt(b["priority"].slice(1));
    if (priorityA === priorityB) {
        // if we have same priority, sort by rank
        // During triage rank will be decided on based on its importance
        // If we have same rank then we sort them by points
        // Lesser points means easier to fix (in theory, if we're lucky and the stars align)
        return SortByRank(a, b);
    }
    return priorityA > priorityB;
}

function SortByTime(a, b) {
    let aDate = new Date(a);
    let bDate = new Date(b);

    if (aDate < bDate) {
        return -1;
    }

    if (bDate < aDate) {
        return 1;
    }

    return 0;
}

function GetQueueTimeHelper(datarow, flag) {
    let addedTime = datarow[flag];
    if (addedTime != "unknown") {
        return addedTime;
    }

    return datarow["creation_time"];
}

function GetQueueTimeWithFlag(datarow, flag) {
    let addedTime = GetQueueTimeHelper(datarow, flag);
    return ToRelativeDate(addedTime);
}

function SortByQueueTimeWithFlag(a, b, flag) {
    let aTime = GetQueueTimeHelper(a, flag);
    let bTime = GetQueueTimeHelper(b, flag);
    return SortByTime(aTime, bTime);
}
