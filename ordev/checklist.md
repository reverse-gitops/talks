# Øredev checklist

Talk 1 is Thu 5 Nov 14:55 in Stamp, talk 2 Fri 6 Nov 11:15 in Turing. The cluster can only have one active room at a time, so the switch from Stamp to Turing happens between the two talks.

## Before talk 1

- [ ] Make `ConfigButler/dotnet-consumption-example` public (it is still private)
- [ ] Show that the settings image can be consumed: the dotnet example mounts `coffee-settings` and reads the menu. What that takes, in order ([building-blocks.md](program/building-blocks.md#what-fits-in-two-days)):
  - [ ] The library reads `resources/` (today it reads only `objects/`)
  - [ ] The app binds `CoffeeConfig`, or a card-reveal settings repo is published the same way
  - [ ] A container image for the app, and a Deployment that mounts the settings image (P4a in k8s `docs/settings-image-publishing-plan.md`); the ConfigMap is the fallback
  - [ ] Decrypt at startup with a mounted age key
- [x] The `coffee-settings` workflow also pushes to ghcr.io, and the package is public
- [ ] The "Ship it?" round in `demo-questions.yaml`
- [ ] Rehearse talk 1 end to end, both vote outcomes
- [ ] Seating plan for Stamp: replace the 15x20 placeholder once the hall layout is known
- [ ] Room picture for `ordev-1-stamp` (Room Pass still points at the `mission2` one)
- [ ] Clear Dutch Cloud Native Day's leftovers: `ordev/reset-demo.sh mission2`, check the dry run, then again with `--apply`
- [ ] Clear rehearsal data before going on stage: `ordev/reset-demo.sh ordev-1-stamp`, then `--apply --rounds`

## Resetting

[reset-demo.sh](reset-demo.sh) only shows what it would do until you add `--apply`.

- **In Git:** Seats. The sink commits their removal, and they stay in the history. To restore a row: `git -C external/k8s-trail show <commit before the removal>:seats/row-01.yaml | kubectl -n voter apply -f -` (not tried yet).
- **Not in Git:** Participants and QuizSubmissions. `--apply` saves them to `settings-that-break/reset-backups/` first. That folder holds attendee names, so think before pushing it to a public repo.
- **Left alone:** Rooms, SeatingPlans, CoffeeConfigs, Databases and CommitRequests.

## After talk 1: prepare talk 2 (Thu evening)

Switch rooms first, so nobody can still claim a Stamp seat while it is being cleared. The active room is set in four places in `external/k8s/k8s.koudijs.dev/2-gitops/voter-demo/`. Change all four from `ordev-1-stamp` to `ordev-2-turing` in one commit:

- [ ] `app.yaml`: Voter's `ROOM_NAME`
- [ ] `app.yaml`: Voter's `SEATING_PLAN_NAME`
- [ ] `room-pass.yaml`: Room Pass's `ROOM_NAME`
- [ ] `admission/seat-in-plan-policy.yaml`: the `paramRef` name
- [ ] Seating plan for Turing: replace the 12x25 placeholder if the layout is known
- [ ] Room picture for `ordev-2-turing`
- [ ] After Flux applies it, clear talk 1: `ordev/reset-demo.sh ordev-1-stamp`, check the dry run, then again with `--apply --rounds`
- [ ] Open the Turing join page and claim a seat from a phone
- [ ] Before going on stage: `ordev/reset-demo.sh ordev-2-turing`, then `--apply --rounds`, so that test seat is gone too

## After talk 2

- [ ] `ordev/reset-demo.sh ordev-2-turing`, check the dry run, then again with `--apply`
