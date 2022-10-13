# necko-triage
A simple webapp to help sort things out in necko triaging

# triage guide

Triage Tool
  - Link: https://mozilla-necko.github.io/necko-triage/
  - Remember to provide your bugzilla API key for querying security bugs

Bugzilla
  - UNTRIAGED bugs with no needinfo :  https://mzl.la/2oaZl1K
  - UNTRIAGED bugs: https://mzl.la/2wAv7XZ
  - MALFORMED bugs (have necko-triaged set but no priority): https://mzl.la/2xXf2jc
  - P1 bugs  https://mzl.la/2he1C85
  - P2 bugs  https://mzl.la/2yaD1aO
  - P3 bugs  (backlog) https://mzl.la/2xcYzEL
  - P5 bugs (would take): https://mzl.la/2hdnQXy

Priorities
- P1 bugs (Blocker: get someone assigned ASAP: let all necko folks know (by email or slack) whenever we have a new P1 bug)
- P2 bugs (Active: we intend to work on these now or this quarter)
- P3 bugs (Backlog: P3 usually means no one will work on it in the near future, so we need to be careful)
  - One exception is if we can mark a bug as P3 and also make it block another meta bug, such bugs may be resolved during a project or a focused cleanup, e.g. working on reducing fetch bugs.
- There is no P4--don't use it
  - This is used by bots.
- P5 bugs (would take)

Principles
- P1 bugs MUST have a person assigned
- Non-necko people can be assigned to necko bugs just fine
- Bugs filed by wpt-bot are marked as P4 and not shown in the triage tool. If something is needed there, someone can ni? one of us
- If you’re filing a bug you’ll be working on (or as part of a project you’re working on, even if you won’t be working directly on it), please triage appropriately, so as to not overload whoever is on triage that week :-D

Mark as triaged
- Set [necko-triaged] in the whiteboard for bugs that have been triaged.
- If you know this bug belongs to a certain feature (e.g., QUIC, DoH, etc), remember to make it block the corresponding meta bug(s).
- Set Priority and Severity:
  - Severity only needs to be set when the bug type is `defect`. For other types, set the severity to "N/A"
- More details
  - If it's an urgent bug: Set it to P1 and ni? the owner of the feature or the manager to find an assignee.
  - If you think it's important and needs to be fixed soon, set [necko-priority-review] in the whiteboard.
  - If you already know the root cause of the bug and know how to fix it, set [necko-priority-review] and leave a comment about how to fix it. Someone will pick it up and fix it soon.
  - If it's a security bug, it's usually worth setting [necko-priority-review] and P2.
  - If the bug is not worth [necko-priority-review] and it's not P3, mark it as P2.

Triage steps
- Determine if the reporter has provided all necessary information.
  - If not, we can ask the reporter to see [this page](https://firefox-source-docs.mozilla.org/networking/submitting_networking_bugs.html).
  - We usually ni? the reporter to provide more information.
- If we have STR (steps to reproduce), trying to reproduce the bug locally might be the fastest way to identify the root cause.
- Once we have all needed information:
  - If this is not a networking bug, set the right component for it. `Firefox:General` is the last component to set if you really don't know which component to set.
  - If a networking bug, mark it as triaged (see above).
