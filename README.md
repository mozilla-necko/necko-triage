# necko-triage
A simple webapp to help sort things out in necko triaging

# triage guide

## Triage and Necko's bug handling pipeline
The purpose of Necko's triage process is to organize "new" networking bugs into their appropriate place for handling.
Not all bugs are "new"; some come from other components, some are being revisited or re-opened.

In general, we want to: 
* Validate that bugs belong in the networking component (which are our responsibility)
* Ensure that we have sufficient information to assign a priority and severity.
* Categorize them under appropriate meta bugs for easy tracking 
* Alert performance team of performance impairments

There are two locations we watch for incoming bugs:
* [Triage Helper](https://mozilla-necko.github.io/necko-triage/)
* [Triage Center](https://mozilla.github.io/triage-center/?component=Core%3ANetworking&component=Core%3ANetworking%3A+Cache&component=Core%3ANetworking%3A+Cookies&component=Core%3ANetworking%3A+DNS&component=Core%3ANetworking%3A+Proxy&component=Core%3ANetworking%3A+File&component=Core%3ANetworking%3A+HTTP&component=Core%3ANetworking%3A+JAR&component=Core%3ANetworking%3A+WebSockets)

We use [Bugzilla](https://bugzilla.mozilla.org) to edit the bugs.

Post-triage, a typical bug MAY flow through our handling stages like so:\
`Triage -> New -> Review -> Next -> Priority`

We also have bugs that we are `Monitoring` closely that may require further action.

Also, If you’re filing a new bug you’ll be working on (or as part of a project you’re working on, even if you won’t be working directly on it), please triage appropriately, so as to not overload whoever is on triage that week :-D


## Some quick links to Bugzilla

- UNTRIAGED bugs with no needinfo :  https://mzl.la/2oaZl1K
- UNTRIAGED bugs: https://mzl.la/2wAv7XZ
- MALFORMED bugs (have necko-triaged set but no priority): https://mzl.la/2xXf2jc
- P1 bugs  https://mzl.la/2he1C85
- P2 bugs  https://mzl.la/2yaD1aO
- P3 bugs  (backlog) https://mzl.la/2xcYzEL
- P5 bugs (would take): https://mzl.la/2hdnQXy


## How to Triage

Add to team's upcoming priorities if it seems like something that should be handled soon
- Add `[necko-priority-review]` to the "whiteboard" field to submit for bug review.
- Emergency items can be put directly into `[necko-priority-queue]`
- (See below `Post-triage` for more details) 

Add to relevant meta bugs
- Add the meta bug (ID or alias) to the "blocks" field of the new bug.
- (See the triage helper for the list of existing meta bugs and their aliases)

Handle performance bugs
- All performance related bugs should be added to necko-perf metabug.
- If the issue is one that hurts performance (or you're not sure) set the "Performance Impact" flag to `?`.

Request more information (when necessary)
- Steps to reproduce. You may also want to confirm they actually reproduce.
- [http logs](https://firefox-source-docs.mozilla.org/networking/http/logging.html) should be submitted to necko@mozilla.com to prevent leaking personal information.
- about:crashes - submit crash data to crash-stats.mozilla.org
- about:support - application and system details

Mark as triaged
- Set `[necko-triaged]` in the whiteboard for bugs that have been triaged.
- Set [Priority](https://wiki.mozilla.org/BMO/UserGuide/BugFields#priority) (see below for more)
- Set [Severity](https://wiki.mozilla.org/BMO/UserGuide/BugFields#bug_severity)

Set Rank/Points
- Rank is an estimate on the impact of a bug, it notes the relative importance of P2/S3's against each other. Where 0 is the highest impact.
- Points is an estimate of the complexity/difficulty of fixing a bug, where 1 is low complexity/easy.

## Notes on Priorities

Priorities
- P1 bugs (Blocker: get someone assigned ASAP: also EMAIL necko@moz whenever we have a new P1 bug)
- P2 bugs (Active--we intend to work on these now or this quarter)
- P3 bugs (backlog)
- There is no P4--don't use it
- P5 bugs (would take)

Principles/Rules of Thumb
- P1 bugs MUST have a person assigned
- Sec-highs are generally at least S2s, even with low crash frequency
- S2s should be confirmed as real bugs before being labelled as such
- Non-necko people can be assigned to necko bugs just fine
- Bugs filed by wpt-bot should be marked triaged as P5. If something is needed there, someone can ni? one of us.

## Post-triage

- `New` is where we first put items that will be reviewed in the regular bug meeting. 
It helps readability of the newest items if too many `Review` items linger.
After first viewing in the regular bug meeting a `New` item should be moved into `Review`.
- `Review` is the bucket of bugs that get reviewed in our regular bug review meeting. 
Selected bugs will may get promoted for action. `Review` bugs should have a whiteboard with `[necko-priority-review]`.
- `Next` is essentially used to label bugs that have already been reviewed and agreed upon as going into the priority queue soon. 
This is useful when the review queue gets a bit bloated. `Next` bugs should have a whiteboard with `[necko-priority-review]` and `[necko-next]`.
- `Priority` is the bucket of bugs that are a team priority. We try to pull our bug fixing efforts from this list and keep it at a limited size. `Priority` bugs should have whiteboard `[necko-priority-queue]` label.
- `Monitoring` is the bucket of bugs that we are closely watching. For example, we may be watching for crash spikes or whether a submitted patch has fixed a particular issue. These are relatively passive bugs that should be moved back into the priority pipeline if necessary. Use the whiteboard label `[necko-monitor]` for this bucket.
