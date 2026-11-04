# cr-prep

Objects to create by hand on the cluster before the talk.

## occupied-last-rows.yaml

Five chairs in hall Stamp that the room cannot pick, in the last four rows at the far right:

| Row | Columns |
|-----|---------|
| 13  | 15      |
| 14  | 15      |
| 15  | 15      |
| 16  | 14, 15  |

They are ordinary Seats and look like the other Occupied chairs: grey, 🐧, `reserved:occupied`.

Create them, from this folder:

```sh
kubectl create -f occupied-last-rows.yaml
```

Check them; this should list all five:

```sh
kubectl -n voter get seats.examples.configbutler.ai -l voter.configbutler.ai/seatingplan=ordev-1-stamp | grep -E 'ordev-1-stamp-(13-15|14-15|15-15|16-14|16-15) '
```

## Run this again after a reset

`ordev/reset-demo.sh ordev-1-stamp --apply` removes every Seat on the plan. Flux brings back the
other reserved chairs, because they are in `reserved-seats/ordev-1-stamp.yaml` in `external/k8s`.
These five are not in there, so they stay gone until you create them again.

The Seat policy only accepts a Seat on the active plan, so `ordev-1-stamp` has to be active.
