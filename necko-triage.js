NeckoTriage = function () { };
NeckoTriage.prototype.tables = {};
NeckoTriage.prototype.rootElement = "#necko-triage-root";
NeckoTriage.prototype.version = "1.0.7";
NeckoTriage.prototype.useTabs = false;
NeckoTriage.prototype.components = [
    "Networking",
    "Networking: Cache",
    "Networking: Cookies",
    "Networking: DNS",
    "Networking: Domain Lists",
    "Networking: File",
    "Networking: FTP",
    "Networking: HTTP",
    "Networking: JAR",
    "Networking: WebSockets",
    "DOM: Networking"
];
NeckoTriage.prototype.availableTables = {
    "untriaged-severity-base": {
        "is_user": false,
        "title": "Untriaged bugs (from May 4 '20 and on)",
        "query": {
            // https://bugzilla.mozilla.org/rest/bug?include_fields=id,summary,status&chfield=%5BBug%20creation%5D&chfieldfrom=2016-06-01&component=DOM%3A%20Networking&component=Networking&component=Networking%3A%20Cache&component=Networking%3A%20Cookies&component=Networking%3A%20DNS&component=Networking%3A%20Domain%20Lists&component=Networking%3A%20File&component=Networking%3A%20FTP&component=Networking%3A%20HTTP&component=Networking%3A%20JAR&component=Networking%3A%20WebSockets&email1=intermittent-bug-filer%40mozilla.bugs&email2=wptsync%40mozilla.bugs&emailreporter1=1&emailreporter2=1&emailtype1=notequals&emailtype2=notequals&f1=OP&f10=CP&f11=flagtypes.name&f2=OP&f3=cf_status_firefox_nightly&f4=cf_status_firefox_beta&f5=cf_status_firefox_release&f6=cf_status_firefox_esr&f7=bug_type&f8=CP&f9=bug_severity&j1=OR&n11=1&o11=substring&o3=equals&o4=equals&o5=equals&o6=equals&o7=equals&o9=equals&product=Core&resolution=---&status_whiteboard=%5C%5Bnecko%5C-.%2A%5C%5D&status_whiteboard_type=notregexp&v11=needinfo&v3=---&v4=---&v5=---&v6=---&v7=defect&v9=--
            "chfield": "[Bug creation]",
            "chfieldfrom": "2016-06-01",
            "email1": "intermittent-bug-filer@mozilla.bugs",
            "email2": "wptsync@mozilla.bugs",
            "emailreporter1": "1",
            "emailreporter2": "1",
            "emailtype1": "notequals",
            "emailtype2": "notequals",
            "f1": "OP",
            "f10": "CP",
            "f11": "flagtypes.name",
            "f2": "OP",
            "f3": "cf_status_firefox_nightly",
            "f4": "cf_status_firefox_beta",
            "f5": "cf_status_firefox_release",
            "f6": "cf_status_firefox_esr",
            "f7": "bug_type",
            "f8": "CP",
            "f9": "bug_severity",
            "j1": "OR",
            "n11": "1",
            "o11": "substring",
            "o3": "equals",
            "o4": "equals",
            "o5": "equals",
            "o6": "equals",
            "o7": "equals",
            "o9": "equals",
            "product": "Core",
            "resolution": "---",
            "status_whiteboard": "\\[necko\\-.*\\]",
            "status_whiteboard_type": "notregexp",
            "v11": "needinfo",
            "v3": "---",
            "v4": "---",
            "v5": "---",
            "v6": "---",
            "v7": "defect",
            "v9": "--",
            "component": NeckoTriage.prototype.components,
            "query_format": "advanced",
        },
        "extra_columns": [],
    },
    "untriaged-no-ni-old": {
        "is_user": false,
        "title": "Untriaged bugs (before May 4 '20 - remove this table when it no longer shows bugs)",
        "query": {
            "chfieldto": "Now",
            "n3": "1",
            "v3": "P4",
            "query_based_on": "necko-triage-main-list",
            "keywords_type": "nowords",
            "f3": "priority",
            "known_name": "necko-triage-main-list",
            "chfieldfrom": "2019-02-10",
            "o4": "regexp",
            "resolution": "---",
            "o1": "lessthan",
            "o2": "substring",
            "list_id": "15229198",
            "emailtype1": "notequals",
            "product": "Core",
            "o3": "equals",
            "keywords": "meta%20stalled",
            "email1": "intermittent-bug-filer%40mozilla.bugs",
            "n2": "1",
            "v2": "needinfo",
            "v1": "2020-05-04",
            "n4": "1",
            "v4": "\\[necko-triaged\\]|\\[necko-backlog\\]|\\[necko-would-take\\]|\\[necko-active\\]|\\[necko-next\\]",
            "f1": "creation_ts",
            "f2": "flagtypes.name",
            "f4": "status_whiteboard",
            "query_format": "advanced",
            "component": NeckoTriage.prototype.components,
        },
        "extra_columns": [],
    },
    "untriaged-ni": {
        "is_user": false,
        "title": "Untriaged bugs (awaiting ni?)",
        "query": {
            "status_whiteboard": "\\[necko-triaged\\]",
            "product": "Core",
            "query_format": "advanced",
            "status_whiteboard_type": "notregexp",
            "keywords": "stalled",
            "keywords_type": "nowords",
            "component": NeckoTriage.prototype.components,
            "f1": "flagtypes.name",
            "v1": "needinfo?",
            "resolution": "---",
            "o1": "substring",
            "priority": "--"
        },
        "extra_columns": ["ni-date"],
        "default_sort": "ni-date"
    },
    "malformed": {
        "is_user": false,
        "title": "Malformed bugs",
        "query": {
            "status_whiteboard_type": "regexp",
            "product": "Core",
            "query_format": "advanced",
            "status_whiteboard": "\\[necko-triaged\\]|\\[necko-backlog\\]|\\[necko-would-take\\]|\\[necko-active\\]|\\[necko-next\\]",
            "bug_status": [
                "UNCONFIRMED",
                "NEW",
                "ASSIGNED",
                "REOPENED"
            ],
            "component": NeckoTriage.prototype.components,
            "priority": "--",
            "resolution": "---"
        },
        "extra_columns": [],
        "default_sort": "severity"
    },
    "p1-unassigned": {
        "is_user": false,
        "title": "Unassigned P1 bugs",
        "query": {
            "j_top": "OR",
            "f1": "assigned_to",
            "o1": "isempty",
            "f2": "assigned_to",
            "o2": "equals",
            "v2": "nobody@mozilla.org",
            "product": "Core",
            "query_format": "advanced",
            "component": NeckoTriage.prototype.components,
            "priority": "P1",
            "resolution": "---"
        },
        "extra_columns": [],
        "default_sort": "severity"
    },
    "stalled": {
        "is_user": false,
        "title": "Stalled Bugs",
        "query": {
            "product": "Core",
            "query_format": "advanced",
            "component": NeckoTriage.prototype.components,
            "resolution": "---",
            "keywords": "stalled",
            "keywords_type": "allwords"
        },
        "extra_columns": [],
        "default_sort": "severity"
    }
};
NeckoTriage.prototype.add_more_tables = function () {
    for (comp in this.components) {
        let name = "p2-unassigned-" + comp;
        let title = "Unassigned P2 bugs - " + this.components[comp];
        this.availableTables[name] =  {
            "is_user": false,
            "title": title,
            "query": {
                "j_top": "OR",
                "f1": "assigned_to",
                "o1": "isempty",
                "f2": "assigned_to",
                "o2": "equals",
                "v2": "nobody@mozilla.org",
                "product": "Core",
                "query_format": "advanced",
                "component": [this.components[comp]],
                "priority": "P2",
                "resolution": "---"
            },
            "extra_columns": [],
            "default_sort": "severity",
        };
    }
};
NeckoTriage.prototype.init = function () {
    // Make sure we display the proper version info
    $("#necko-triage-version").text(this.version);

    // Give ourselves a handle to the element, not just its id
    this.rootElement = $(this.rootElement);

    this.settings = new AppSettings();
    $("#menu").menu();
    $("#reload-all").click($.proxy(this, "reloadAll", false));

    this.loadBugzillaMetadata();

    this.add_more_tables();
    // Now load all the tables
    let self = this;
    $.each(this.availableTables, function (k, v) {
        self.tables[k] = new BugTable(k, v, self);
        self.tables[k].create();
    });

    this.createUserTables();

    // Finally, set up the tabs, now that all our DOM elements are in place
    this.useTabs = this.settings.get("show-tables-in-tabs");
    if (this.useTabs) {
        this.rootElement.tabs({
            "activate": (event, ui) => {
                let uiId = ui["newTab"].attr("id");
                let tableId = uiId.replace(/^bug-tab-/, "");
                self.tables[tableId].load();
            }
        });
    }
};
NeckoTriage.prototype.persistProducts = function (data) {
    let ps = data["products"];
    let products = [];
    for (let i = 0; i < ps.length; i++) {
        let product = {"name": ps[i]["name"],
                       "components": []};
        let cs = ps[i]["components"];
        for (let j = 0; j < cs.length; j++) {
            product["components"].push(cs[j]["name"]);
        }
        product["components"].sort();
        products.push(product);
    }
    products.sort((a, b) => {
        let au = a.name.toUpperCase();
        let bu = b.name.toUpperCase();

        if (au < bu) {
            return -1;
        }

        if (au > bu) {
            return 1;
        }

        return 0;
    });
    this.products = products;
    window.localStorage.setItem("bz-products", JSON.stringify(this.products));
};
NeckoTriage.prototype.lazyRefreshProducts = function () {
    let self = this;
    let origin = this.settings.get("testing-only-bugzilla-origin");
    $.getJSON({url: origin + "/rest/product?type=enterable&include_fields=name,components",
               type: "GET",
               traditional: true})
             .then(function (data) { self.persistProducts(data); });
};
NeckoTriage.prototype.loadBugzillaMetadata = async function () {
    let origin = this.settings.get("testing-only-bugzilla-origin");
    let self = this;

    this.statuses = [];
    await $.getJSON(origin + "/rest/field/bug/status/values").then((data) => {
        self.statuses = data["values"];
    });

    this.resolutions = [];
    await $.getJSON(origin + "/rest/field/bug/resolution/values").then((data) => {
        self.resolutions = data["values"];
    });

    let products = window.localStorage.getItem("bz-products");
    if (products) {
        this.products = JSON.parse(products);
        this.lazyRefreshProducts();
    } else {
        this.products = [];
        await $.getJSON({url: origin + "/rest/product?type=enterable&include_fields=name",
                        type: "GET",
                        traditional: true})
                    .then(function (data) { self.products = data["products"]; }).promise();
        this.products.sort((a, b) => {
            let au = a.name.toUpperCase();
            let bu = b.name.toUpperCase();

            if (au < bu) {
                return -1;
            }

            if (au > bu) {
                return 1;
            }

            return 0;
        });

        this.lazyRefreshProducts();
    }
};
NeckoTriage.prototype.reloadAll = function (resetUserTables) {
    // In addition to destroying our tables if the user has un-checked the box,
    // we need to destroy them (temporarily) if we're changing the list of
    // user tables. This allows jquery-ui to set the proper classes on the new
    // tables so they'll properly display as tabs.
    if (this.useTabs && (resetUserTables || !this.settings.get("show-tables-in-tabs"))) {
        this.rootElement.tabs("destroy");
    }

    if (resetUserTables) {
        $(".user-table").remove();
        $(".user-table-tab").remove();

        let newTables = {};
        $.each(this.tables, function (k, table) {
            if (!table.isUser) {
                newTables[k] = table;
            }
        });
        this.tables = newTables;
    }

    $.each(this.tables, function (k, table) {
        table.load();
    });

    if (resetUserTables) {
        this.createUserTables();
    }

    // This is the pair for the block at the top of this method - enable our tabs
    // if (1) they're newly enabled, or (2) they were enabled *and* we changed
    // the table list.
    if ((!this.useTabs && this.settings.get("show-tables-in-tabs")) ||
        (this.useTabs && resetUserTables)) {
        this.rootElement.tabs();
    }

    this.useTabs = this.settings.get("show-tables-in-tabs");
};
NeckoTriage.prototype.createUserTables = function () {
    let customQueries = this.settings.get("custom-queries");
    let self = this;
    $.each(customQueries, function (i, customQuery) {
        self.createUserTable(i, customQuery);
    });
};
NeckoTriage.prototype.createUserTable = function (index, customQuery) {
    let queryConfig = $.extend({}, customQuery);
    queryConfig["extra_columns"] = [];
    queryConfig["default_sort"] = "severity";
    queryConfig["is_user"] = true;

    let tableID = "user-query-" + index;
    this.tables[tableID] = new BugTable(tableID, queryConfig, this);
    this.tables[tableID].create();
};

NeckoTriage.prototype.autocompleteEmail = async function (request, response) {
    let api_key = this.settings.get("bz-apikey");
    let url = this.settings.get("testing-only-bugzilla-origin") + "/rest/user?api_key=" + api_key + "&match=" + request["term"];
    let matches;

    await $.getJSON({
        url: url,
        type: "GET",
        processData: false,
        headers: {"Content-Type": "application/json"}
    }).done((data) => { matches = data["users"]; }).promise();

    response(matches.map(x => x["email"]));
};
